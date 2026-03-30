"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Target,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Copy,
  Clock,
  Zap,
  Award,
  Briefcase,
  BarChart3,
  Lightbulb,
  Star,
  BookOpen,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

type StrengthWithIcon = {
  skill: string
  level: string
  evidence: string
  icon: any
}

type GapItem = {
  skill: string
  importance: string
  currentLevel: number
  suggestion: string
}

type ResultsAnalysisData = {
  role: string
  company: string
  readinessScore: number
  confidenceLevel: string
  atsScore: number
  analyzedAt: string
  matchSummary: string
  strengths: StrengthWithIcon[]
  skillGaps: {
    technical: GapItem[]
    productBusiness: GapItem[]
    communication: GapItem[]
    toolsPlatforms: GapItem[]
  }
  atsKeywords: {
    matched: string[]
    missing: string[]
    score: number
  }
  resumeSuggestions: Array<{
    type: "add" | "reframe"
    title: string
    current: string | null
    improved: string
    impact: string
  }>
  nextSteps: {
    now: Array<{ action: string; effort: string; impact: string }>
    soon: Array<{ action: string; effort: string; impact: string }>
    later: Array<{ action: string; effort: string; impact: string }>
  }
  certifications: Array<{
    name: string
    provider: string
    time: string
    relevance: string
    free: boolean
  }>
  projectIdeas: Array<{
    title: string
    complexity: string
    signal: string
    description: string
  }>
  marketSignals: {
    themes: string[]
    expectations: string[]
    salaryRange: string
    demandLevel: string
  }
  rawNotes: string
}

type GapBucketKey = "technical" | "productBusiness" | "communication" | "toolsPlatforms"
type StepBucketKey = "now" | "soon" | "later"
type SavedAnalysisRecord = {
  id: string
  savedAt: string
  role: string
  company: string
  readinessScore: number
  confidenceLevel: string
  atsScore: number
  matchSummary: string
  analysis: ResultsAnalysisData
}

const emptyAnalysisData: ResultsAnalysisData = {
  role: "Target Role",
  company: "Unknown",
  readinessScore: 0,
  confidenceLevel: "Medium",
  atsScore: 0,
  analyzedAt: "Just now",
  matchSummary: "No analysis available yet.",
  strengths: [],
  skillGaps: {
    technical: [],
    productBusiness: [],
    communication: [],
    toolsPlatforms: [],
  },
  atsKeywords: {
    matched: [],
    missing: [],
    score: 0,
  },
  resumeSuggestions: [],
  nextSteps: {
    now: [],
    soon: [],
    later: [],
  },
  certifications: [],
  projectIdeas: [],
  marketSignals: {
    themes: [],
    expectations: [],
    salaryRange: "Not specified",
    demandLevel: "Medium",
  },
  rawNotes: "",
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

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
}

function pickStrengthIcon(skill: string) {
  const value = skill.toLowerCase()

  if (
    value.includes("strategy") ||
    value.includes("roadmap") ||
    value.includes("planning")
  ) {
    return Target
  }

  if (
    value.includes("stakeholder") ||
    value.includes("leadership") ||
    value.includes("management") ||
    value.includes("cross-functional")
  ) {
    return Briefcase
  }

  if (
    value.includes("research") ||
    value.includes("discovery") ||
    value.includes("insight")
  ) {
    return Lightbulb
  }

  if (
    value.includes("agile") ||
    value.includes("scrum") ||
    value.includes("delivery") ||
    value.includes("execution")
  ) {
    return Zap
  }

  if (
    value.includes("data") ||
    value.includes("analytics") ||
    value.includes("sql") ||
    value.includes("metrics")
  ) {
    return BarChart3
  }

  return Star
}

function gapBucketForSkill(skill: string): GapBucketKey {
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

function defaultCurrentLevel(importance: string) {
  const normalized = importance.toLowerCase()
  if (normalized === "critical") return 30
  if (normalized === "high") return 45
  if (normalized === "medium") return 60
  return 75
}

function normalizeGapItem(item: any): GapItem {
  const importance = asString(item?.importance, "Medium")

  return {
    skill: asString(item?.skill, "Gap"),
    importance,
    currentLevel: clampPercent(
      item?.currentLevel,
      defaultCurrentLevel(importance)
    ),
    suggestion: asString(item?.suggestion, "Build more evidence in this area."),
  }
}

function normalizeSkillGaps(raw: any) {
  const empty = {
    technical: [] as GapItem[],
    productBusiness: [] as GapItem[],
    communication: [] as GapItem[],
    toolsPlatforms: [] as GapItem[],
  }

  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      const gap = normalizeGapItem(item)
      const bucket = gapBucketForSkill(gap.skill)
      empty[bucket].push(gap)
    })
    return empty
  }

  if (raw && typeof raw === "object") {
    return {
      technical: Array.isArray(raw.technical)
        ? raw.technical.map(normalizeGapItem)
        : [],
      productBusiness: Array.isArray(raw.productBusiness)
        ? raw.productBusiness.map(normalizeGapItem)
        : [],
      communication: Array.isArray(raw.communication)
        ? raw.communication.map(normalizeGapItem)
        : [],
      toolsPlatforms: Array.isArray(raw.toolsPlatforms)
        ? raw.toolsPlatforms.map(normalizeGapItem)
        : [],
    }
  }

  return empty
}

function normalizeNextSteps(raw: any) {
  const empty = {
    now: [] as Array<{ action: string; effort: string; impact: string }>,
    soon: [] as Array<{ action: string; effort: string; impact: string }>,
    later: [] as Array<{ action: string; effort: string; impact: string }>,
  }

  const normalizeStep = (item: any) => ({
    action: asString(item?.action, "Next step"),
    effort: asString(item?.effort, "Medium"),
    impact: asString(item?.impact, "Medium"),
  })

  const inferBucket = (action: string, effort: string): StepBucketKey => {
    const value = `${action} ${effort}`.toLowerCase()

    if (value.includes("hour") || value.includes("today") || value.includes("now")) {
      return "now"
    }

    if (value.includes("day") || value.includes("week") || value.includes("soon")) {
      return "soon"
    }

    return "later"
  }

  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      const step = normalizeStep(item)
      const bucket = inferBucket(step.action, step.effort)
      empty[bucket].push(step)
    })
    return empty
  }

  if (raw && typeof raw === "object") {
    return {
      now: Array.isArray(raw.now) ? raw.now.map(normalizeStep) : [],
      soon: Array.isArray(raw.soon) ? raw.soon.map(normalizeStep) : [],
      later: Array.isArray(raw.later) ? raw.later.map(normalizeStep) : [],
    }
  }

  return empty
}

function normalizeResultsAnalysis(raw: any): ResultsAnalysisData {
  const source = raw?.analysis ?? raw ?? {}
  const atsScore = clampPercent(source?.atsScore ?? source?.atsKeywords?.score, 0)

  return {
    role: asString(source?.role, emptyAnalysisData.role),
    company: asString(source?.company, emptyAnalysisData.company),
    readinessScore: clampPercent(
      source?.readinessScore,
      emptyAnalysisData.readinessScore
    ),
    confidenceLevel: asString(
      source?.confidenceLevel,
      emptyAnalysisData.confidenceLevel
    ),
    atsScore,
    analyzedAt: asString(source?.analyzedAt, emptyAnalysisData.analyzedAt),
    matchSummary: asString(
      source?.matchSummary,
      emptyAnalysisData.matchSummary
    ),
    strengths: Array.isArray(source?.strengths)
      ? source.strengths.map((item: any) => ({
          skill: asString(item?.skill, "Strength"),
          level: asString(item?.level, "Strong"),
          evidence: asString(item?.evidence, "Relevant experience found."),
          icon: pickStrengthIcon(asString(item?.skill, "")),
        }))
      : [],
    skillGaps: normalizeSkillGaps(source?.skillGaps),
    atsKeywords: {
      matched: asStringArray(source?.atsKeywords?.matched),
      missing: asStringArray(source?.atsKeywords?.missing),
      score: atsScore,
    },
    resumeSuggestions: Array.isArray(source?.resumeSuggestions)
      ? source.resumeSuggestions.map((item: any) => ({
          type:
            asString(item?.type, "add").toLowerCase() === "reframe"
              ? "reframe"
              : "add",
          title: asString(item?.title, "Resume improvement"),
          current:
            typeof item?.current === "string" && item.current.trim().length > 0
              ? item.current.trim()
              : null,
          improved: asString(item?.improved, "Suggested rewrite"),
          impact: asString(item?.impact, "Medium"),
        }))
      : [],
    nextSteps: normalizeNextSteps(source?.nextSteps),
    certifications: Array.isArray(source?.certifications)
      ? source.certifications.map((item: any) => ({
          name: asString(item?.name, "Recommended certification"),
          provider: asString(item?.provider, "Recommended provider"),
          time: asString(item?.time, "Varies"),
          relevance: asString(item?.relevance, "Medium"),
          free: Boolean(item?.free),
        }))
      : [],
    projectIdeas: Array.isArray(source?.projectIdeas)
      ? source.projectIdeas.map((item: any) => ({
          title: asString(item?.title, "Portfolio project"),
          complexity: asString(item?.complexity, "Medium"),
          signal: asString(item?.signal, "Medium"),
          description: asString(
            item?.description,
            "A project idea relevant to this role."
          ),
        }))
      : [],
    marketSignals: {
      themes: asStringArray(source?.marketSignals?.themes),
      expectations: asStringArray(source?.marketSignals?.expectations),
      salaryRange: asString(
        source?.marketSignals?.salaryRange,
        emptyAnalysisData.marketSignals.salaryRange
      ),
      demandLevel: asString(
        source?.marketSignals?.demandLevel,
        emptyAnalysisData.marketSignals.demandLevel
      ),
    },
    rawNotes: asString(source?.rawNotes, ""),
  }
}

function getImportanceBadgeClass(value: string) {
  const normalized = value.toLowerCase()

  if (normalized === "critical") {
    return "bg-[#FF8FA3]/20 text-[#FF8FA3]"
  }

  if (normalized === "high") {
    return "bg-[#E87BF1]/20 text-[#E87BF1]"
  }

  if (normalized === "medium") {
    return "bg-[#7ED7F7]/20 text-[#4FA7A7]"
  }

  return "bg-[#3C4166]/10 text-[#6B6F8E]"
}

function getImpactBadgeClass(value: string) {
  const normalized = value.toLowerCase()

  if (normalized === "critical") {
    return "bg-[#FF8FA3]/20 text-[#FF8FA3]"
  }

  if (normalized === "high") {
    return "bg-[#E87BF1]/20 text-[#E87BF1]"
  }

  if (normalized === "medium") {
    return "bg-[#7ED7F7]/20 text-[#4FA7A7]"
  }

  return "bg-[#3C4166]/10 text-[#6B6F8E]"
}

function getCategoryDotClass(key: GapBucketKey) {
  if (key === "technical") return "from-[#FF8FA3] to-[#F7C7D4]"
  if (key === "productBusiness") return "from-[#E87BF1] to-[#C9B6E4]"
  if (key === "communication") return "from-[#7ED7F7] to-[#4FA7A7]"
  return "from-[#C9B6E4] to-[#F7C7D4]"
}

const gapCategories: Array<{
  key: GapBucketKey
  label: string
}> = [
  { key: "technical", label: "Technical Skills" },
  { key: "productBusiness", label: "Product & Business" },
  { key: "communication", label: "Communication" },
  { key: "toolsPlatforms", label: "Tools & Platforms" },
]

const nextStepBuckets: Array<{
  key: StepBucketKey
  label: string
  sublabel: string
  dotClass: string
}> = [
  {
    key: "now",
    label: "Do Now",
    sublabel: "Quick wins",
    dotClass: "bg-[#4FA7A7]",
  },
  {
    key: "soon",
    label: "Do Soon",
    sublabel: "This week",
    dotClass: "bg-[#E87BF1]",
  },
  {
    key: "later",
    label: "Do Later",
    sublabel: "This month",
    dotClass: "bg-[#7ED7F7]",
  },
]

export default function AnalysisResultsPage() {
  const [analysisData, setAnalysisData] = useState<ResultsAnalysisData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [expandedGaps, setExpandedGaps] = useState<GapBucketKey[]>(["technical"])
  const [savedSuggestions, setSavedSuggestions] = useState<number[]>([])
  const resultsPrintRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("kestrel_last_analysis")

      if (raw) {
        const parsed = JSON.parse(raw)
        setAnalysisData(normalizeResultsAnalysis(parsed))
      }
    } catch (error) {
      console.error("Failed to load saved analysis:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const toggleGapCategory = (category: GapBucketKey) => {
    setExpandedGaps((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const handleSaveAnalysis = () => {
    if (!analysisData) return

    try {
      const existingRaw = window.localStorage.getItem("kestrel_saved_analyses")
      const existing = existingRaw ? JSON.parse(existingRaw) : []

      const nextItem: SavedAnalysisRecord = {
        id: `analysis_${Date.now()}`,
        savedAt: new Date().toISOString(),
        role: analysisData.role,
        company: analysisData.company,
        readinessScore: analysisData.readinessScore,
        confidenceLevel: analysisData.confidenceLevel,
        atsScore: analysisData.atsScore,
        matchSummary: analysisData.matchSummary,
        analysis: analysisData,
      }

      const normalizedExisting = Array.isArray(existing) ? existing : []

      const deduped = normalizedExisting.filter((item: any) => {
        return !(
          item?.role === nextItem.role &&
          item?.company === nextItem.company &&
          item?.matchSummary === nextItem.matchSummary
        )
      })

      const nextSaved = [nextItem, ...deduped]

      window.localStorage.setItem(
        "kestrel_saved_analyses",
        JSON.stringify(nextSaved)
      )

      window.dispatchEvent(new Event("kestrel-saved-analyses-updated"))

      window.alert("Saved to Saved Analyses.")
    } catch (error) {
      console.error("Failed to save analysis:", error)
      window.alert("Could not save this analysis.")
    }
  }

  const handleExportPdf = () => {
    if (typeof window === "undefined") return

    const currentTitle = document.title
    document.body.classList.add("kestrel-print-results")
    document.title = `${analysisData?.role || "Kestrel Analysis"} - ${analysisData?.company || "Results"}`

    setTimeout(() => {
      window.print()

      setTimeout(() => {
        document.body.classList.remove("kestrel-print-results")
        document.title = currentTitle
      }, 200)
    }, 100)
  }

  const handleCompare = () => {
    if (!analysisData) return

    try {
      window.localStorage.setItem(
        "kestrel_compare_baseline",
        JSON.stringify({
          id: `compare_${Date.now()}`,
          savedAt: new Date().toISOString(),
          role: analysisData.role,
          company: analysisData.company,
          analysis: analysisData,
        })
      )

      window.alert("Saved this analysis as your comparison baseline.")
    } catch (error) {
      console.error("Failed to save comparison baseline:", error)
      window.alert("Could not save comparison baseline.")
    }
  }

  const handleCopySuggestion = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setSavedSuggestions((prev) =>
        prev.includes(index) ? prev : [...prev, index]
      )
    } catch (error) {
      console.error("Failed to copy suggestion:", error)
    }
  }

  if (!isLoaded) {
    return null
  }

  if (!analysisData) {
    return (
      <div id="analysis-print-root" className="pb-20 lg:pb-0">
        <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4FA7A7]/20 to-[#E87BF1]/20">
              <AlertCircle className="h-6 w-6 text-[#E87BF1]" />
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-[#3C4166]">
              No saved analysis found
            </h1>
            <p className="mx-auto mb-6 max-w-md text-sm text-[#6B6F8E]">
              Run a new analysis first so this page can display your real AI output.
            </p>
            <Link href="/dashboard/analysis">
              <Button className="bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7] text-white hover:opacity-90">
                Start New Analysis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div ref={resultsPrintRef} className="pb-20 lg:pb-0">
      <Card className="mb-8 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-[#3C4166]/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#4FA7A7]/10 via-[#7ED7F7]/10 to-[#C9B6E4]/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <CardContent className="relative pt-8 pb-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="flex items-start gap-6">
              <div className="relative flex-shrink-0">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-[#3C4166]/10"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(analysisData.readinessScore / 100) * 352} 352`}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4FA7A7" />
                      <stop offset="100%" stopColor="#7ED7F7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-[#3C4166]">
                    {analysisData.readinessScore}
                  </span>
                  <span className="text-xs text-[#6B6F8E]">Readiness</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#4FA7A7]/10 px-2.5 py-1 text-xs font-medium text-[#4FA7A7]">
                    {analysisData.confidenceLevel} Confidence
                  </span>
                  <span className="rounded-full bg-[#C9B6E4]/20 px-2.5 py-1 text-xs text-[#6B6F8E]">
                    {analysisData.analyzedAt}
                  </span>
                </div>

                <h1 className="mb-1 text-2xl font-semibold text-[#3C4166] sm:text-3xl">
                  {analysisData.role}
                </h1>

                <p className="mb-4 text-lg text-[#6B6F8E]">
                  at {analysisData.company}
                </p>

                <p className="max-w-xl text-sm leading-relaxed text-[#6B6F8E]">
                  {analysisData.matchSummary}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:flex-col">
            <Button
  variant="outline"
  size="sm"
  onClick={handleSaveAnalysis}
  className="border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5"
>
  <Bookmark className="mr-2 h-4 w-4" />
  Save Analysis
</Button>

<Button
  variant="outline"
  size="sm"
  onClick={handleExportPdf}
  className="border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5"
>
  <Download className="mr-2 h-4 w-4" />
  Export PDF
</Button>

<Button
  variant="outline"
  size="sm"
  onClick={handleCompare}
  className="border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5"
>
  <Share2 className="mr-2 h-4 w-4" />
  Compare
</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C8F5DF] to-[#4FA7A7]/30">
                    <CheckCircle2 className="h-5 w-5 text-[#4FA7A7]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">Your Strengths</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">
                      What you already bring to this role
                    </CardDescription>
                  </div>
                </div>
                <span className="text-sm font-medium text-[#4FA7A7]">
                  {analysisData.strengths.length} matched
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {analysisData.strengths.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#3C4166]/10 p-6 text-sm text-[#6B6F8E]">
                  No strengths returned yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisData.strengths.map((strength) => {
                    const Icon = strength.icon
                    return (
                      <div
                        key={strength.skill}
                        className="flex items-start gap-4 rounded-xl border border-[#4FA7A7]/10 bg-gradient-to-r from-[#C8F5DF]/30 to-transparent p-4"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#4FA7A7]/10">
                          <Icon className="h-5 w-5 text-[#4FA7A7]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <h4 className="font-medium text-[#3C4166]">{strength.skill}</h4>
                            <span className="rounded-full bg-[#C8F5DF] px-2 py-0.5 text-xs text-[#4FA7A7]">
                              {strength.level}
                            </span>
                          </div>
                          <p className="text-sm text-[#6B6F8E]">{strength.evidence}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8FA3]/20 to-[#E87BF1]/20">
                  <TrendingUp className="h-5 w-5 text-[#E87BF1]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Skill Gaps to Address</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">
                    Organized by category for focused improvement
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {gapCategories.map((category) => {
                const gaps = analysisData.skillGaps[category.key]
                const isExpanded = expandedGaps.includes(category.key)

                return (
                  <div
                    key={category.key}
                    className="overflow-hidden rounded-xl border border-[#3C4166]/10"
                  >
                    <button
                      onClick={() => toggleGapCategory(category.key)}
                      className="flex w-full items-center justify-between p-4 transition-colors hover:bg-[#F6F1E7]/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full bg-gradient-to-r",
                            getCategoryDotClass(category.key)
                          )}
                        />
                        <span className="font-medium text-[#3C4166]">{category.label}</span>
                        <span className="rounded-full bg-[#3C4166]/10 px-2 py-0.5 text-xs text-[#6B6F8E]">
                          {gaps.length} gaps
                        </span>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-[#6B6F8E]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#6B6F8E]" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="space-y-3 px-4 pb-4">
                        {gaps.length === 0 ? (
                          <div className="rounded-xl bg-[#F6F1E7]/40 p-4 text-sm text-[#6B6F8E]">
                            No gaps returned in this category.
                          </div>
                        ) : (
                          gaps.map((gap) => (
                            <div key={gap.skill} className="rounded-xl bg-[#F6F1E7]/50 p-4">
                              <div className="mb-3 flex items-center justify-between">
                                <h4 className="font-medium text-[#3C4166]">{gap.skill}</h4>
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-xs",
                                    getImportanceBadgeClass(gap.importance)
                                  )}
                                >
                                  {gap.importance}
                                </span>
                              </div>

                              <div className="mb-3">
                                <div className="mb-1 flex justify-between text-xs text-[#6B6F8E]">
                                  <span>Current Level</span>
                                  <span>{gap.currentLevel}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-[#3C4166]/10">
                                  <div
                                    className={cn(
                                      "h-full rounded-full bg-gradient-to-r",
                                      gap.currentLevel < 50
                                        ? "from-[#FF8FA3] to-[#F7C7D4]"
                                        : gap.currentLevel < 70
                                          ? "from-[#E87BF1] to-[#C9B6E4]"
                                          : "from-[#4FA7A7] to-[#7ED7F7]"
                                    )}
                                    style={{ width: `${gap.currentLevel}%` }}
                                  />
                                </div>
                              </div>

                              <p className="text-sm text-[#6B6F8E]">
                                <span className="font-medium text-[#3C4166]">Action:</span>{" "}
                                {gap.suggestion}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E87BF1]/20 to-[#C9B6E4]/20">
                  <FileText className="h-5 w-5 text-[#E87BF1]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Resume Upgrade Suggestions</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">
                    Before vs after improvements
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {analysisData.resumeSuggestions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#3C4166]/10 p-6 text-sm text-[#6B6F8E]">
                  No resume suggestions returned yet.
                </div>
              ) : (
                analysisData.resumeSuggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.title}-${index}`}
                    className="rounded-xl border border-[#3C4166]/10 bg-[#F6F1E7]/35 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs",
                            suggestion.type === "reframe"
                              ? "bg-[#7ED7F7]/20 text-[#4FA7A7]"
                              : "bg-[#C8F5DF] text-[#4FA7A7]"
                          )}
                        >
                          {suggestion.type === "reframe" ? "Reframe" : "Add"}
                        </span>
                        <h4 className="font-medium text-[#3C4166]">{suggestion.title}</h4>
                      </div>

                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          getImpactBadgeClass(suggestion.impact)
                        )}
                      >
                        {suggestion.impact} Impact
                      </span>
                    </div>

                    {suggestion.current && (
                      <p className="mb-2 text-sm text-[#6B6F8E]">
                        <span className="font-medium text-[#FF8FA3]">Before:</span>{" "}
                        <span className="line-through">{suggestion.current}</span>
                      </p>
                    )}

                    <p className="mb-3 text-sm text-[#6B6F8E]">
                      <span className="font-medium text-[#4FA7A7]">After:</span>{" "}
                      <span className="font-medium text-[#3C4166]">
                        {suggestion.improved}
                      </span>
                    </p>

                    <button
                      type="button"
                      onClick={() => handleCopySuggestion(suggestion.improved, index)}
                      className="inline-flex items-center gap-2 text-xs text-[#6B6F8E] transition-colors hover:text-[#3C4166]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {savedSuggestions.includes(index) ? "Copied" : "Copy"}
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7ED7F7]/20 to-[#4FA7A7]/20">
                  <Clock className="h-5 w-5 text-[#4FA7A7]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Next Steps Strategy</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">
                    Prioritized actions to improve your match
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {nextStepBuckets.map((bucket) => {
                const items = analysisData.nextSteps[bucket.key]

                return (
                  <div key={bucket.key}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className={cn("h-3 w-3 rounded-full", bucket.dotClass)} />
                      <h4 className="font-medium text-[#3C4166]">{bucket.label}</h4>
                      <span className="text-xs text-[#6B6F8E]">{bucket.sublabel}</span>
                    </div>

                    {items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#3C4166]/10 p-4 text-sm text-[#6B6F8E]">
                        No actions returned in this bucket.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div
                            key={`${item.action}-${index}`}
                            className={cn(
                              "flex items-center justify-between gap-4 rounded-xl px-4 py-3",
                              bucket.key === "now" && "bg-[#C8F5DF]/30",
                              bucket.key === "soon" && "bg-[#F3E3F9]/60",
                              bucket.key === "later" && "bg-[#E8F6FB]/80"
                            )}
                          >
                            <p className="text-sm text-[#3C4166]">{item.action}</p>
                            <div className="flex items-center gap-3 text-xs text-[#6B6F8E]">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.effort}
                              </span>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5",
                                  getImpactBadgeClass(item.impact)
                                )}
                              >
                                {item.impact}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {analysisData.rawNotes && (
            <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9B6E4]/20 to-[#7ED7F7]/20">
                    <Lightbulb className="h-5 w-5 text-[#6B6F8E]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">Extra Notes</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">
                      Additional analysis context
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-[#6B6F8E]">
                  {analysisData.rawNotes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7ED7F7]/20 to-[#4FA7A7]/20">
                    <BarChart3 className="h-5 w-5 text-[#4FA7A7]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">ATS Score</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">
                      Keyword alignment
                    </CardDescription>
                  </div>
                </div>
                <span className="text-2xl font-semibold text-[#4FA7A7]">
                  {analysisData.atsKeywords.score}%
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#6B6F8E]">
                  Found in Resume
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysisData.atsKeywords.matched.length === 0 ? (
                    <span className="text-sm text-[#6B6F8E]">No matched keywords returned.</span>
                  ) : (
                    analysisData.atsKeywords.matched.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-[#C8F5DF]/70 px-2.5 py-1 text-xs text-[#4FA7A7]"
                      >
                        {keyword}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#6B6F8E]">
                  Missing Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysisData.atsKeywords.missing.length === 0 ? (
                    <span className="text-sm text-[#6B6F8E]">No missing keywords returned.</span>
                  ) : (
                    analysisData.atsKeywords.missing.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-[#FF8FA3]/15 px-2.5 py-1 text-xs text-[#FF8FA3]"
                      >
                        {keyword}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E87BF1]/20 to-[#C9B6E4]/20">
                  <Award className="h-5 w-5 text-[#E87BF1]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Certifications</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">
                    Recommended credentials
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {analysisData.certifications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#3C4166]/10 p-4 text-sm text-[#6B6F8E]">
                  No certification suggestions returned.
                </div>
              ) : (
                analysisData.certifications.map((cert, index) => (
                  <div
                    key={`${cert.name}-${index}`}
                    className="rounded-xl border border-[#3C4166]/10 bg-[#F6F1E7]/35 p-4"
                  >
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <h4 className="font-medium text-[#3C4166]">{cert.name}</h4>
                      {cert.free && (
                        <span className="rounded-full bg-[#C8F5DF] px-2 py-0.5 text-xs text-[#4FA7A7]">
                          Free
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#6B6F8E]">{cert.provider}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#6B6F8E]">
                      <span>{cert.time}</span>
                      <span className="rounded-full bg-[#C9B6E4]/20 px-2 py-0.5">
                        {cert.relevance} relevance
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8FA3]/20 to-[#F7C7D4]/20">
                  <BookOpen className="h-5 w-5 text-[#FF8FA3]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Project Ideas</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">
                    Portfolio suggestions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {analysisData.projectIdeas.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#3C4166]/10 p-4 text-sm text-[#6B6F8E]">
                  No project ideas returned.
                </div>
              ) : (
                analysisData.projectIdeas.map((project, index) => (
                  <div
                    key={`${project.title}-${index}`}
                    className="rounded-xl border border-[#3C4166]/10 bg-[#F6F1E7]/35 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h4 className="font-medium text-[#3C4166]">{project.title}</h4>
                      <div className="flex gap-2">
                        <span className="rounded-full bg-[#7ED7F7]/20 px-2 py-0.5 text-xs text-[#4FA7A7]">
                          {project.complexity}
                        </span>
                        <span className="rounded-full bg-[#E87BF1]/20 px-2 py-0.5 text-xs text-[#E87BF1]">
                          {project.signal} signal
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#6B6F8E]">{project.description}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7ED7F7]/20 to-[#C9B6E4]/20">
                  <Layers className="h-5 w-5 text-[#6B6F8E]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Market Signals</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">
                    Industry trends and expectations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#6B6F8E]">
                  Recurring Themes
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysisData.marketSignals.themes.length === 0 ? (
                    <span className="text-sm text-[#6B6F8E]">No themes returned.</span>
                  ) : (
                    analysisData.marketSignals.themes.map((theme) => (
                      <span
                        key={theme}
                        className="rounded-full bg-[#E8F6FB] px-2.5 py-1 text-xs text-[#4FA7A7]"
                      >
                        {theme}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#6B6F8E]">
                  Common Expectations
                </p>
                {analysisData.marketSignals.expectations.length === 0 ? (
                  <span className="text-sm text-[#6B6F8E]">No expectations returned.</span>
                ) : (
                  <ul className="space-y-2 text-sm text-[#6B6F8E]">
                    {analysisData.marketSignals.expectations.map((expectation) => (
                      <li key={expectation} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#4FA7A7]" />
                        <span>{expectation}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-[#3C4166]/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B6F8E]">Salary Range</span>
                  <span className="font-medium text-[#3C4166]">
                    {analysisData.marketSignals.salaryRange}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-[#6B6F8E]">Demand</span>
                  <span className="rounded-full bg-[#C8F5DF] px-2 py-0.5 text-xs text-[#4FA7A7]">
                    {analysisData.marketSignals.demandLevel}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}