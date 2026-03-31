import { NextResponse } from "next/server"
import OpenAI from "openai"

export const runtime = "nodejs"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

type ResumeLabBullet = {
  id: number
  section: string
  company: string
  role: string
  original: string
  optimized: string
  keywords: string[]
  status: "needs-improvement" | "good"
  impact: "critical" | "high" | "medium" | "low"
}

function normalizeBullet(item: any, fallbackId: number): ResumeLabBullet {
  const rawStatus = toNonEmptyString(item?.status, "needs-improvement")
  const status = rawStatus === "good" ? "good" : "needs-improvement"

  const rawImpact = toNonEmptyString(item?.impact, "medium").toLowerCase()
  const impact =
    rawImpact === "critical" ||
    rawImpact === "high" ||
    rawImpact === "medium" ||
    rawImpact === "low"
      ? rawImpact
      : "medium"

  return {
    id:
      typeof item?.id === "number" && Number.isFinite(item.id)
        ? item.id
        : fallbackId,
    section: toNonEmptyString(item?.section, "experience"),
    company: toNonEmptyString(item?.company, "Experience"),
    role: toNonEmptyString(item?.role, "Relevant role"),
    original: toNonEmptyString(item?.original, "Resume bullet"),
    optimized: toNonEmptyString(item?.optimized, "Suggested rewrite"),
    keywords: toStringArray(item?.keywords).slice(0, 6),
    status,
    impact: impact as ResumeLabBullet["impact"],
  }
}

function normalizeKeywordSuggestion(item: any) {
  const rawImportance = toNonEmptyString(item?.importance, "Medium")
  const importance =
    rawImportance === "Critical" ||
    rawImportance === "High" ||
    rawImportance === "Medium" ||
    rawImportance === "Low"
      ? rawImportance
      : "Medium"

  const rawStatus = toNonEmptyString(item?.status, "missing")
  const status =
    rawStatus === "present" || rawStatus === "partial" || rawStatus === "missing"
      ? rawStatus
      : "missing"

  return {
    keyword: toNonEmptyString(item?.keyword, "Keyword"),
    importance,
    status,
    context: toNonEmptyString(
      item?.context,
      "Add this keyword naturally where it is supported by your experience."
    ),
  }
}

function normalizeFramingSuggestion(item: any) {
  return {
    title: toNonEmptyString(item?.title, "Framing tip"),
    description: toNonEmptyString(item?.description, "A useful framing improvement."),
    example: toNonEmptyString(item?.example, "Add metrics and outcomes."),
  }
}

function normalizeResumeLabResult(raw: any, fallbackRole: string, fallbackCompany: string) {
  const bullets = Array.isArray(raw?.bullets)
    ? raw.bullets.map((item: any, index: number) => normalizeBullet(item, index + 1)).slice(0, 8)
    : []

  const keywordSuggestions = Array.isArray(raw?.keywordSuggestions)
    ? raw.keywordSuggestions.map(normalizeKeywordSuggestion).slice(0, 10)
    : []

  const framingSuggestions = Array.isArray(raw?.framingSuggestions)
    ? raw.framingSuggestions.map(normalizeFramingSuggestion).slice(0, 6)
    : []

  return {
    role: toNonEmptyString(raw?.role, fallbackRole),
    company: toNonEmptyString(raw?.company, fallbackCompany),
    currentAtsScore: clampPercent(raw?.currentAtsScore, 0),
    potentialScore: clampPercent(raw?.potentialScore, 0),
    bullets,
    keywordSuggestions,
    framingSuggestions,
    optimizedResumeText: toNonEmptyString(raw?.optimizedResumeText, ""),
    summary: toNonEmptyString(raw?.summary, ""),
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "resume-lab route is live",
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

    const formData = await request.formData()

    const selectedAnalysisRaw = String(formData.get("selectedAnalysis") || "{}")
    const bulletToRegenerateRaw = String(formData.get("bulletToRegenerate") || "")
    const existingBulletsRaw = String(formData.get("existingBullets") || "[]")
    const resumeText = cleanText(String(formData.get("resumeText") || ""))

    let selectedAnalysis: any = {}
    let bulletToRegenerate: any = null
    let existingBullets: any[] = []

    try {
      selectedAnalysis = JSON.parse(selectedAnalysisRaw)
    } catch {}

    try {
      bulletToRegenerate = bulletToRegenerateRaw ? JSON.parse(bulletToRegenerateRaw) : null
    } catch {}

    try {
      existingBullets = JSON.parse(existingBulletsRaw)
      if (!Array.isArray(existingBullets)) existingBullets = []
    } catch {
      existingBullets = []
    }

    const resumeFile = formData.get("resumeFile")
    let normalizedResumeText = resumeText

    if (resumeFile instanceof File && resumeFile.size > 0) {
      normalizedResumeText = await extractResumeText(resumeFile)
    }

    const role = toNonEmptyString(
      selectedAnalysis?.role ?? selectedAnalysis?.analysis?.role,
      "Target Role"
    )
    const company = toNonEmptyString(
      selectedAnalysis?.company ?? selectedAnalysis?.analysis?.company,
      "Unknown"
    )
    const matchSummary = toNonEmptyString(
      selectedAnalysis?.matchSummary ?? selectedAnalysis?.analysis?.matchSummary,
      ""
    )

    const strengths = JSON.stringify(selectedAnalysis?.analysis?.strengths ?? [], null, 2)
    const skillGaps = JSON.stringify(selectedAnalysis?.analysis?.skillGaps ?? {}, null, 2)
    const atsKeywords = JSON.stringify(selectedAnalysis?.analysis?.atsKeywords ?? {}, null, 2)
    const resumeSuggestions = JSON.stringify(selectedAnalysis?.analysis?.resumeSuggestions ?? [], null, 2)
    const marketSignals = JSON.stringify(selectedAnalysis?.analysis?.marketSignals ?? {}, null, 2)

    if (!normalizedResumeText) {
      return NextResponse.json(
        { error: "Missing saved or uploaded resume text." },
        { status: 400 }
      )
    }

    if (!role) {
      return NextResponse.json(
        { error: "Missing selected analysis." },
        { status: 400 }
      )
    }

    if (bulletToRegenerate) {
      const prompt = `
You are Kestrel Resume Lab.

Rewrite ONE resume bullet for this target role.

Return ONLY valid JSON in this exact shape:
{
  "bullet": {
    "id": 1,
    "section": "experience | skills",
    "company": "string",
    "role": "string",
    "original": "string",
    "optimized": "string",
    "keywords": ["string"],
    "status": "needs-improvement | good",
    "impact": "critical | high | medium | low"
  }
}

Rules:
- Keep the rewrite honest and resume-ready.
- Make it stronger, more ATS-aligned, and more impact-driven.
- Add role-relevant keywords naturally.
- Do not invent impossible achievements.
- Keep it to one bullet only.

Target role: ${role}
Company: ${company}
Match summary: ${matchSummary}

Role signals:
Strengths:
${strengths}

Skill gaps:
${skillGaps}

ATS keywords:
${atsKeywords}

Resume suggestions:
${resumeSuggestions}

Market signals:
${marketSignals}

Current resume:
${normalizedResumeText}

Existing bullets:
${JSON.stringify(existingBullets, null, 2)}

Bullet to regenerate:
${JSON.stringify(bulletToRegenerate, null, 2)}
`.trim()

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Return only valid JSON. No markdown fences.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content || ""
      const parsed = parseJsonFromModel(content)

      if (!parsed?.bullet) {
        return NextResponse.json(
          { error: "Could not parse regenerated bullet from model output." },
          { status: 500 }
        )
      }

      return NextResponse.json({
        bullet: normalizeBullet(parsed.bullet, Number(bulletToRegenerate?.id) || 1),
        resumeWordCount: normalizedResumeText.split(/\s+/).filter(Boolean).length,
      })
    }

    const prompt = `
You are Kestrel Resume Lab.

Using the selected saved role analysis and the user's current resume, generate a role-specific resume optimization plan.

Return ONLY valid JSON in this exact shape:
{
  "role": "string",
  "company": "string",
  "currentAtsScore": 0,
  "potentialScore": 0,
  "bullets": [
    {
      "id": 1,
      "section": "experience | skills",
      "company": "string",
      "role": "string",
      "original": "string",
      "optimized": "string",
      "keywords": ["string"],
      "status": "needs-improvement | good",
      "impact": "critical | high | medium | low"
    }
  ],
  "keywordSuggestions": [
    {
      "keyword": "string",
      "importance": "Critical | High | Medium | Low",
      "status": "missing | partial | present",
      "context": "string"
    }
  ],
  "framingSuggestions": [
    {
      "title": "string",
      "description": "string",
      "example": "string"
    }
  ],
  "optimizedResumeText": "string",
  "summary": "string"
}

Rules:
- Base suggestions on the user's actual resume text.
- Keep rewrites plausible and resume-ready.
- Improve ATS alignment and impact.
- Prioritize the most important changes for this target role.
- Include 4 to 8 bullet rewrites.
- Include 6 to 10 keyword suggestions.
- Include 3 to 5 framing suggestions.
- optimizedResumeText should be a polished plain-text draft using the stronger bullet language where appropriate.

Target role: ${role}
Company: ${company}
Match summary: ${matchSummary}

Role signals:
Strengths:
${strengths}

Skill gaps:
${skillGaps}

ATS keywords:
${atsKeywords}

Resume suggestions:
${resumeSuggestions}

Market signals:
${marketSignals}

User resume:
${normalizedResumeText}
`.trim()

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Return only valid JSON. No markdown fences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content || ""
    const parsed = parseJsonFromModel(content)

    if (!parsed) {
      return NextResponse.json(
        { error: "Could not parse Resume Lab output from model response." },
        { status: 500 }
      )
    }

    const normalized = normalizeResumeLabResult(parsed, role, company)

    return NextResponse.json({
      ...normalized,
      resumeWordCount: normalizedResumeText.split(/\s+/).filter(Boolean).length,
    })
  } catch (error) {
    console.error("Resume Lab API error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate Resume Lab output.",
      },
      { status: 500 }
    )
  }
}