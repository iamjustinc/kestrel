import { NextResponse } from "next/server"
import OpenAI from "openai"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function cleanText(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

async function extractResumeText(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase()
  const buffer = Buffer.from(await file.arrayBuffer())

  if (extension === "pdf") {
    const pdfParse = (await import("pdf-parse")).default
    const parsed = await pdfParse(buffer)
    return cleanText(parsed.text || "")
  }

  if (extension === "docx") {
    const mammoth = await import("mammoth")
    const parsed = await mammoth.extractRawText({ buffer })
    return cleanText(parsed.value || "")
  }

  if (extension === "txt") {
    return cleanText(buffer.toString("utf8"))
  }

  throw new Error("Unsupported resume format. Please upload PDF, DOCX, or TXT.")
}

function parseJsonFromModel(text: string) {
  const trimmed = text.trim()

  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim()

  try {
    return JSON.parse(withoutFence)
  } catch {}

  const firstBrace = withoutFence.indexOf("{")
  const lastBrace = withoutFence.lastIndexOf("}")

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const possibleJson = withoutFence.slice(firstBrace, lastBrace + 1)
    try {
      return JSON.parse(possibleJson)
    } catch {}
  }

  return null
}

function clampPercent(value: unknown, fallback = 0) {
  const num =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN

  if (!Number.isFinite(num)) return fallback
  return Math.max(0, Math.min(100, Math.round(num)))
}

function toNonEmptyString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
}

function normalizeConfidenceLevel(value: unknown) {
  const normalized = toNonEmptyString(value, "Medium")
  return normalized === "Low" || normalized === "Medium" || normalized === "High"
    ? normalized
    : "Medium"
}

function normalizeStrengths(raw: unknown) {
  if (!Array.isArray(raw)) return []

  return raw.slice(0, 5).map((item: any) => ({
    skill: toNonEmptyString(item?.skill, "Strength"),
    level: toNonEmptyString(item?.level, "Strong"),
    evidence: toNonEmptyString(item?.evidence, "Relevant experience found."),
  }))
}

function defaultCurrentLevel(importance: string) {
  const normalized = importance.toLowerCase()
  if (normalized === "critical") return 30
  if (normalized === "high") return 45
  if (normalized === "medium") return 60
  return 75
}

function normalizeGapItem(item: any) {
  const importance = toNonEmptyString(item?.importance, "Medium")

  return {
    skill: toNonEmptyString(item?.skill, "Gap"),
    importance,
    currentLevel: clampPercent(
      item?.currentLevel,
      defaultCurrentLevel(importance)
    ),
    suggestion: toNonEmptyString(
      item?.suggestion,
      "Build more evidence in this area."
    ),
  }
}

function emptySkillGapBuckets() {
  return {
    technical: [] as Array<{
      skill: string
      importance: string
      currentLevel: number
      suggestion: string
    }>,
    productBusiness: [] as Array<{
      skill: string
      importance: string
      currentLevel: number
      suggestion: string
    }>,
    communication: [] as Array<{
      skill: string
      importance: string
      currentLevel: number
      suggestion: string
    }>,
    toolsPlatforms: [] as Array<{
      skill: string
      importance: string
      currentLevel: number
      suggestion: string
    }>,
  }
}

function inferGapBucket(skill: string) {
  const value = skill.toLowerCase()

  if (
    value.includes("jira") ||
    value.includes("azure") ||
    value.includes("ado") ||
    value.includes("smartsheet") ||
    value.includes("google workspace") ||
    value.includes("salesforce") ||
    value.includes("mulesoft") ||
    value.includes("agentforce") ||
    value.includes("cloud") ||
    value.includes("tool") ||
    value.includes("platform")
  ) {
    return "toolsPlatforms"
  }

  if (
    value.includes("stakeholder") ||
    value.includes("communication") ||
    value.includes("executive") ||
    value.includes("governance") ||
    value.includes("documentation") ||
    value.includes("reporting")
  ) {
    return "communication"
  }

  if (
    value.includes("budget") ||
    value.includes("financial") ||
    value.includes("resource") ||
    value.includes("planning") ||
    value.includes("roadmap") ||
    value.includes("program") ||
    value.includes("delivery") ||
    value.includes("agile") ||
    value.includes("scrum") ||
    value.includes("safe")
  ) {
    return "productBusiness"
  }

  return "technical"
}

function normalizeSkillGaps(raw: unknown) {
  const buckets = emptySkillGapBuckets()

  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      const gap = normalizeGapItem(item)
      const bucket = inferGapBucket(gap.skill)
      buckets[bucket].push(gap)
    })
    return buckets
  }

  if (raw && typeof raw === "object") {
    const source = raw as Record<string, unknown>

    return {
      technical: Array.isArray(source.technical)
        ? source.technical.map(normalizeGapItem).slice(0, 4)
        : [],
      productBusiness: Array.isArray(source.productBusiness)
        ? source.productBusiness.map(normalizeGapItem).slice(0, 4)
        : [],
      communication: Array.isArray(source.communication)
        ? source.communication.map(normalizeGapItem).slice(0, 4)
        : [],
      toolsPlatforms: Array.isArray(source.toolsPlatforms)
        ? source.toolsPlatforms.map(normalizeGapItem).slice(0, 4)
        : [],
    }
  }

  return buckets
}

function normalizeResumeSuggestions(raw: unknown) {
  if (!Array.isArray(raw)) return []

  return raw.slice(0, 6).map((item: any) => {
    const rawType = toNonEmptyString(item?.type, "add").toLowerCase()
    const type = rawType === "reframe" ? "reframe" : "add"
    const rawImpact = toNonEmptyString(item?.impact, "Medium")
    const impact =
      rawImpact === "Critical" ||
      rawImpact === "High" ||
      rawImpact === "Medium" ||
      rawImpact === "Low"
        ? rawImpact
        : "Medium"

    return {
      type,
      title: toNonEmptyString(item?.title, "Resume improvement"),
      current:
        typeof item?.current === "string" && item.current.trim().length > 0
          ? item.current.trim()
          : null,
      improved: toNonEmptyString(item?.improved, "Suggested rewrite"),
      impact,
    }
  })
}

function normalizeStep(item: any) {
  const rawImpact = toNonEmptyString(item?.impact, "Medium")
  const impact =
    rawImpact === "Critical" ||
    rawImpact === "High" ||
    rawImpact === "Medium" ||
    rawImpact === "Low"
      ? rawImpact
      : "Medium"

  return {
    action: toNonEmptyString(item?.action, "Next step"),
    effort: toNonEmptyString(item?.effort, "Medium"),
    impact,
  }
}

function emptyNextSteps() {
  return {
    now: [] as Array<{ action: string; effort: string; impact: string }>,
    soon: [] as Array<{ action: string; effort: string; impact: string }>,
    later: [] as Array<{ action: string; effort: string; impact: string }>,
  }
}

function inferStepBucket(action: string, effort: string) {
  const value = `${action} ${effort}`.toLowerCase()

  if (value.includes("hour") || value.includes("today") || value.includes("now")) {
    return "now"
  }

  if (value.includes("day") || value.includes("week") || value.includes("soon")) {
    return "soon"
  }

  return "later"
}

function normalizeNextSteps(raw: unknown) {
  const buckets = emptyNextSteps()

  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      const step = normalizeStep(item)
      const bucket = inferStepBucket(step.action, step.effort)
      buckets[bucket].push(step)
    })
    return buckets
  }

  if (raw && typeof raw === "object") {
    const source = raw as Record<string, unknown>

    return {
      now: Array.isArray(source.now)
        ? source.now.map(normalizeStep).slice(0, 4)
        : [],
      soon: Array.isArray(source.soon)
        ? source.soon.map(normalizeStep).slice(0, 4)
        : [],
      later: Array.isArray(source.later)
        ? source.later.map(normalizeStep).slice(0, 4)
        : [],
    }
  }

  return buckets
}

function normalizeCertifications(raw: unknown) {
  if (!Array.isArray(raw)) return []

  return raw.slice(0, 4).map((item: any) => {
    const rawRelevance = toNonEmptyString(item?.relevance, "Medium")
    const relevance =
      rawRelevance === "High" ||
      rawRelevance === "Medium" ||
      rawRelevance === "Low"
        ? rawRelevance
        : "Medium"

    return {
      name: toNonEmptyString(item?.name, "Recommended certification"),
      provider: toNonEmptyString(item?.provider, "Recommended provider"),
      time: toNonEmptyString(item?.time, "Varies"),
      relevance,
      free: Boolean(item?.free),
    }
  })
}

function normalizeProjectIdeas(raw: unknown) {
  if (!Array.isArray(raw)) return []

  return raw.slice(0, 4).map((item: any) => {
    const rawComplexity = toNonEmptyString(item?.complexity, "Medium")
    const complexity =
      rawComplexity === "High" ||
      rawComplexity === "Medium" ||
      rawComplexity === "Low"
        ? rawComplexity
        : "Medium"

    const rawSignal = toNonEmptyString(item?.signal, "Medium")
    const signal =
      rawSignal === "High" ||
      rawSignal === "Medium" ||
      rawSignal === "Low"
        ? rawSignal
        : "Medium"

    return {
      title: toNonEmptyString(item?.title, "Portfolio project"),
      complexity,
      signal,
      description: toNonEmptyString(
        item?.description,
        "A project idea relevant to this role."
      ),
    }
  })
}

function normalizeMarketSignals(raw: any) {
  return {
    themes: toStringArray(raw?.themes).slice(0, 8),
    expectations: toStringArray(raw?.expectations).slice(0, 6),
    salaryRange: toNonEmptyString(raw?.salaryRange, "Not specified"),
    demandLevel: toNonEmptyString(raw?.demandLevel, "Medium"),
  }
}

function splitRoleAndCompany(rawRole: unknown, rawCompany: unknown) {
  let role = toNonEmptyString(rawRole, "Target Role")
  let company = toNonEmptyString(rawCompany, "Unknown")

  role = role.replace(/\s+\(.*?\)\s*$/, "").trim()

  if (company === "Unknown") {
    const match = role.match(
      /^([A-Z][A-Za-z0-9&.\- ]+?)\s+(Project Manager|Product Manager|Program Manager|Consultant|Engineer|Designer|Analyst|Developer|Architect|Lead|Manager)\b/
    )

    if (match) {
      const possibleCompany = match[1].trim()
      const strippedRole = match[2].trim()

      const blockedPrefixes = new Set([
        "Senior",
        "Lead",
        "Principal",
        "Staff",
        "Global",
        "Technical",
        "Solutions",
        "Growth",
        "Product",
        "Project",
        "Program",
        "Associate",
        "Junior",
      ])

      if (!blockedPrefixes.has(possibleCompany)) {
        company = possibleCompany
        role = strippedRole
      }
    }
  }

  return {
    role: role || "Target Role",
    company: company || "Unknown",
  }
}

function normalizeAnalysis(raw: any) {
  if (!raw || typeof raw !== "object") return null

  const roleCompany = splitRoleAndCompany(raw?.role, raw?.company)
  const atsScore = clampPercent(raw?.atsScore ?? raw?.atsKeywords?.score, 0)

  return {
    role: roleCompany.role,
    company: roleCompany.company,
    readinessScore: clampPercent(raw?.readinessScore, 0),
    confidenceLevel: normalizeConfidenceLevel(raw?.confidenceLevel),
    atsScore,
    analyzedAt: toNonEmptyString(raw?.analyzedAt, "Just now"),
    matchSummary: toNonEmptyString(
      raw?.matchSummary,
      "No summary returned."
    ),
    strengths: normalizeStrengths(raw?.strengths),
    skillGaps: normalizeSkillGaps(raw?.skillGaps),
    atsKeywords: {
      matched: toStringArray(raw?.atsKeywords?.matched),
      missing: toStringArray(raw?.atsKeywords?.missing),
      score: atsScore,
    },
    resumeSuggestions: normalizeResumeSuggestions(raw?.resumeSuggestions),
    nextSteps: normalizeNextSteps(raw?.nextSteps),
    certifications: normalizeCertifications(raw?.certifications),
    projectIdeas: normalizeProjectIdeas(raw?.projectIdeas),
    marketSignals: normalizeMarketSignals(raw?.marketSignals),
    rawNotes: toNonEmptyString(raw?.rawNotes, ""),
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "analyze route is live",
  })
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      )
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const formData = await request.formData()

    const jobDescription = cleanText(String(formData.get("jobDescription") || ""))
    const jobUrl = cleanText(String(formData.get("jobUrl") || ""))
    const targetRole = cleanText(String(formData.get("targetRole") || ""))
    const timeline = cleanText(String(formData.get("timeline") || ""))
    const notes = cleanText(String(formData.get("notes") || ""))
    const resumeText = cleanText(String(formData.get("resumeText") || ""))
    const savedProfileResumeText = cleanText(
      String(formData.get("savedProfileResumeText") || "")
    )

    const resumeFile = formData.get("resumeFile")
    let normalizedResumeText = ""

    if (resumeFile instanceof File && resumeFile.size > 0) {
      normalizedResumeText = await extractResumeText(resumeFile)
    } else if (resumeText) {
      normalizedResumeText = resumeText
    } else if (savedProfileResumeText) {
      normalizedResumeText = savedProfileResumeText
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Missing job description." },
        { status: 400 }
      )
    }

    if (!normalizedResumeText) {
      return NextResponse.json(
        { error: "Missing resume content." },
        { status: 400 }
      )
    }

    const prompt = `
You are Kestrel, an AI career analysis assistant.

Analyze the fit between this job description and this candidate profile.

Return ONLY valid JSON in this exact shape:
{
  "role": "string",
  "company": "string",
  "readinessScore": 0,
  "confidenceLevel": "Low | Medium | High",
  "atsScore": 0,
  "analyzedAt": "string",
  "matchSummary": "string",
  "strengths": [
    {
      "skill": "string",
      "level": "string",
      "evidence": "string"
    }
  ],
  "skillGaps": {
    "technical": [
      {
        "skill": "string",
        "importance": "Critical | High | Medium | Low",
        "currentLevel": 0,
        "suggestion": "string"
      }
    ],
    "productBusiness": [
      {
        "skill": "string",
        "importance": "Critical | High | Medium | Low",
        "currentLevel": 0,
        "suggestion": "string"
      }
    ],
    "communication": [
      {
        "skill": "string",
        "importance": "Critical | High | Medium | Low",
        "currentLevel": 0,
        "suggestion": "string"
      }
    ],
    "toolsPlatforms": [
      {
        "skill": "string",
        "importance": "Critical | High | Medium | Low",
        "currentLevel": 0,
        "suggestion": "string"
      }
    ]
  },
  "atsKeywords": {
    "matched": ["string"],
    "missing": ["string"],
    "score": 0
  },
  "resumeSuggestions": [
    {
      "type": "add | reframe",
      "title": "string",
      "current": "string or null",
      "improved": "string",
      "impact": "Critical | High | Medium | Low"
    }
  ],
  "nextSteps": {
    "now": [
      {
        "action": "string",
        "effort": "string",
        "impact": "Critical | High | Medium | Low"
      }
    ],
    "soon": [
      {
        "action": "string",
        "effort": "string",
        "impact": "Critical | High | Medium | Low"
      }
    ],
    "later": [
      {
        "action": "string",
        "effort": "string",
        "impact": "Critical | High | Medium | Low"
      }
    ]
  },
  "certifications": [
    {
      "name": "string",
      "provider": "string",
      "time": "string",
      "relevance": "High | Medium | Low",
      "free": true
    }
  ],
  "projectIdeas": [
    {
      "title": "string",
      "complexity": "High | Medium | Low",
      "signal": "High | Medium | Low",
      "description": "string"
    }
  ],
  "marketSignals": {
    "themes": ["string"],
    "expectations": ["string"],
    "salaryRange": "string",
    "demandLevel": "string"
  },
  "rawNotes": "string"
}

Critical rules:
- Use ONLY evidence explicitly present in the pasted resume/profile
- Never invent experience, certifications, tools, domains, leadership level, metrics, or years of experience
- If something is missing, put it in gaps or missing keywords rather than pretending it exists
- Make the analysis specific to THIS job description, not a generic product manager role
- resumeSuggestions.improved must be a suggested rewrite or suggestion, not a fabricated fact
- strength evidence must paraphrase something actually present in the resume/profile
- If the candidate is clearly underqualified for hard requirements, lower readinessScore accordingly
- atsScore and readinessScore must be integers from 0 to 100
- company should be "Unknown" if not stated
- strengths should have 3 to 5 items
- each skill gap bucket may have 0 to 4 items
- resumeSuggestions should have 3 to 6 items
- nextSteps.now should have 1 to 3 items
- nextSteps.soon should have 1 to 4 items
- nextSteps.later should have 1 to 4 items
- certifications should have 0 to 4 items
- projectIdeas should have 0 to 4 items
- rawNotes should be short
- return JSON only, no markdown, no code fences

TARGET ROLE: ${targetRole || "Not provided"}
TIMELINE: ${timeline || "Not provided"}
USER NOTES: ${notes || "None"}
JOB URL: ${jobUrl || "Not provided"}

JOB DESCRIPTION:
${jobDescription}

RESUME / PROFILE:
${normalizedResumeText}
    `.trim()

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a grounded career analysis assistant. Be strict, evidence-based, and do not hallucinate experience.",
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }],
        },
      ],
    })

    const analysisText = response.output_text || ""
    const parsed = parseJsonFromModel(analysisText)
    const normalizedAnalysis = normalizeAnalysis(parsed)

    if (!normalizedAnalysis) {
      return NextResponse.json(
        {
          error: "Model returned invalid analysis JSON.",
          analysisText,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ok: true,
      analysisText,
      analysis: normalizedAnalysis,
      normalizedResumeText,
      meta: {
        usedJobUrl: Boolean(jobUrl),
        usedTargetRole: Boolean(targetRole),
        usedTimeline: Boolean(timeline),
        usedNotes: Boolean(notes),
      },
    })
  } catch (error) {
    console.error("Analyze route error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while analyzing.",
      },
      { status: 500 }
    )
  }
}