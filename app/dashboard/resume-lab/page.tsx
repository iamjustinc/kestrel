"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
  Download,
  Settings2,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"

type SavedProfile = {
  resumeText: string
  updatedAt: string
}

type SavedAnalysis = {
  id: string
  role: string
  company: string
  readinessScore: number
  confidenceLevel: string
  atsScore: number
  matchSummary: string
  savedAt: string
  analysis?: any
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

type KeywordSuggestion = {
  keyword: string
  importance: "Critical" | "High" | "Medium" | "Low"
  status: "missing" | "partial" | "present"
  context: string
}

type FramingSuggestion = {
  title: string
  description: string
  example: string
}

type ResumeLabResponse = {
  role: string
  company: string
  currentAtsScore: number
  potentialScore: number
  bullets: ResumeLabBullet[]
  keywordSuggestions: KeywordSuggestion[]
  framingSuggestions: FramingSuggestion[]
  optimizedResumeText: string
  summary: string
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

function getCachedKey(analysisId: string) {
  return `kestrel_resume_lab_${analysisId}`
}

const defaultFramingSuggestions: FramingSuggestion[] = [
  {
    title: "Lead with impact, not tasks",
    description: "Start bullets with outcomes and metrics, then explain how you achieved them.",
    example: "Instead of 'Managed product backlog' → 'Prioritized 200+ backlog items driving 30% velocity increase'",
  },
  {
    title: "Quantify everything possible",
    description: "Numbers make your experience concrete and comparable.",
    example: "Team size, users impacted, revenue generated, time saved, efficiency gains",
  },
  {
    title: "Use strong action verbs",
    description: "Choose verbs that demonstrate leadership and ownership.",
    example: "Led, Drove, Spearheaded, Architected, Launched, Scaled",
  },
  {
    title: "Show cross-functional impact",
    description: "Highlight collaboration across engineering, design, marketing, and leadership.",
    example: "Partnered with engineering and design to improve delivery speed and user outcomes",
  },
]

export default function ResumeLabPage() {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([])
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null)

  const [selectedAnalysisId, setSelectedAnalysisId] = useState("")
  const [expandedBullets, setExpandedBullets] = useState<number[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [selectedSection, setSelectedSection] = useState<"all" | "experience" | "skills">("all")

  const [labResult, setLabResult] = useState<ResumeLabResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [regeneratingBulletId, setRegeneratingBulletId] = useState<number | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      const rawSavedAnalyses = window.localStorage.getItem("kestrel_saved_analyses")
      const parsedAnalyses = rawSavedAnalyses ? JSON.parse(rawSavedAnalyses) : []

      const normalizedAnalyses = Array.isArray(parsedAnalyses)
        ? parsedAnalyses.map((item: any) => ({
            id: asString(item?.id, `analysis_${Date.now()}`),
            role: asString(item?.role ?? item?.analysis?.role, "Target Role"),
            company: asString(item?.company ?? item?.analysis?.company, "Unknown"),
            readinessScore: clampPercent(item?.readinessScore ?? item?.analysis?.readinessScore, 0),
            confidenceLevel: asString(
              item?.confidenceLevel ?? item?.analysis?.confidenceLevel,
              "Medium"
            ),
            atsScore: clampPercent(item?.atsScore ?? item?.analysis?.atsScore ?? item?.analysis?.atsKeywords?.score, 0),
            matchSummary: asString(item?.matchSummary ?? item?.analysis?.matchSummary, ""),
            savedAt: asString(item?.savedAt, new Date().toISOString()),
            analysis: item?.analysis ?? item,
          }))
        : []

      setSavedAnalyses(normalizedAnalyses)

      if (normalizedAnalyses.length > 0) {
        setSelectedAnalysisId((prev) => prev || normalizedAnalyses[0].id)
      }

      const rawSavedProfile = window.localStorage.getItem("kestrel_saved_profile")
      if (rawSavedProfile) {
        const parsedProfile = JSON.parse(rawSavedProfile)
        if (parsedProfile?.resumeText) {
          setSavedProfile({
            resumeText: asString(parsedProfile.resumeText, ""),
            updatedAt: asString(parsedProfile.updatedAt, new Date().toISOString()),
          })
        }
      }
    } catch (err) {
      console.error("Failed to load Resume Lab data:", err)
    }
  }, [])

  useEffect(() => {
    if (!selectedAnalysisId) return

    try {
      const cached = window.localStorage.getItem(getCachedKey(selectedAnalysisId))
      if (cached) {
        const parsed = JSON.parse(cached) as ResumeLabResponse
        setLabResult(parsed)
        setExpandedBullets(parsed.bullets.slice(0, 2).map((bullet) => bullet.id))
      } else {
        setLabResult(null)
        setExpandedBullets([])
      }
    } catch (err) {
      console.error("Failed to load cached Resume Lab result:", err)
    }
  }, [selectedAnalysisId])

  const selectedAnalysis = useMemo(
    () => savedAnalyses.find((item) => item.id === selectedAnalysisId) ?? null,
    [savedAnalyses, selectedAnalysisId]
  )

  const filteredBullets = useMemo(() => {
    if (!labResult) return []

    if (selectedSection === "all") return labResult.bullets
    return labResult.bullets.filter((bullet) =>
      bullet.section.toLowerCase() === selectedSection
    )
  }, [labResult, selectedSection])

  const toggleExpanded = (id: number) => {
    setExpandedBullets((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleGenerate = async () => {
    if (!selectedAnalysis) {
      setError("Please select a saved role first.")
      return
    }

    if (!savedProfile?.resumeText) {
      setError("No saved resume profile found. Run an analysis first so Kestrel can save your resume text.")
      return
    }

    setError("")
    setIsGenerating(true)

    try {
      const response = await fetch("/api/resume-lab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedAnalysis,
          resumeText: savedProfile.resumeText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate Resume Lab suggestions.")
      }

      setLabResult(data)
      setExpandedBullets(data.bullets.slice(0, 2).map((bullet: ResumeLabBullet) => bullet.id))
      window.localStorage.setItem(getCachedKey(selectedAnalysis.id), JSON.stringify(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate Resume Lab suggestions.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerateBullet = async (bullet: ResumeLabBullet) => {
    if (!selectedAnalysis || !savedProfile?.resumeText || !labResult) return

    setError("")
    setRegeneratingBulletId(bullet.id)

    try {
      const response = await fetch("/api/resume-lab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedAnalysis,
          resumeText: savedProfile.resumeText,
          bulletToRegenerate: {
            id: bullet.id,
            original: bullet.original,
            section: bullet.section,
            company: bullet.company,
            role: bullet.role,
          },
          existingBullets: labResult.bullets,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to regenerate this bullet.")
      }

      const nextResult: ResumeLabResponse = {
        ...labResult,
        bullets: labResult.bullets.map((item) =>
          item.id === bullet.id ? data.bullet : item
        ),
      }

      setLabResult(nextResult)
      window.localStorage.setItem(getCachedKey(selectedAnalysis.id), JSON.stringify(nextResult))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to regenerate this bullet.")
    } finally {
      setRegeneratingBulletId(null)
    }
  }

  const handleExportOptimized = () => {
    if (!labResult?.optimizedResumeText) return

    const blob = new Blob([labResult.optimizedResumeText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${labResult.role || "resume"}-optimized.txt`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  const bulletsToImprove = labResult?.bullets.filter((bullet) => bullet.status === "needs-improvement").length ?? 0
  const missingKeywords = labResult?.keywordSuggestions.filter((item) => item.status === "missing").length ?? 0
  const highImpactChanges =
    labResult?.bullets.filter((bullet) => bullet.impact === "critical" || bullet.impact === "high").length ?? 0

  const currentAtsScore = labResult?.currentAtsScore ?? selectedAnalysis?.atsScore ?? 0
  const potentialScore = labResult?.potentialScore ?? Math.max(currentAtsScore, 0)

  return (
    <div className="pb-20 lg:pb-0">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#3C4166] sm:text-3xl">
            Resume Lab
          </h1>
          <p className="mt-1 text-[#6B6F8E]">
            Tailor your resume to a saved role with AI
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportOptimized}
            disabled={!labResult?.optimizedResumeText}
            className="border-[#3C4166]/15 text-[#3C4166]"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Optimized
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedAnalysis || !savedProfile?.resumeText}
            className="bg-[#4FA7A7] text-white hover:bg-[#4FA7A7]/90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Reanalyze All"}
          </Button>
        </div>
      </div>

      <Card className="mb-6 border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#3C4166]">
                Choose saved role
              </label>
              <select
                value={selectedAnalysisId}
                onChange={(e) => setSelectedAnalysisId(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#3C4166]/10 bg-white px-4 text-sm text-[#3C4166] focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
              >
                {savedAnalyses.length === 0 ? (
                  <option value="">No saved analyses found</option>
                ) : (
                  savedAnalyses.map((analysis) => (
                    <option key={analysis.id} value={analysis.id}>
                      {analysis.role} at {analysis.company}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="rounded-xl border border-[#3C4166]/10 bg-[#F6F1E7]/50 p-4">
              <div className="mb-1 text-sm font-medium text-[#3C4166]">
                Resume source
              </div>
              <p className="text-sm text-[#6B6F8E]">
                {savedProfile?.resumeText
                  ? `Saved resume loaded (${savedProfile.resumeText.split(/\s+/).filter(Boolean).length} words)`
                  : "No saved resume profile found yet."}
              </p>
            </div>
          </div>

          {selectedAnalysis && (
            <div className="mt-4 rounded-xl border border-[#4FA7A7]/15 bg-[#4FA7A7]/5 p-4">
              <div className="text-sm font-medium text-[#3C4166]">
                Targeting: {selectedAnalysis.role} at {selectedAnalysis.company}
              </div>
              <p className="mt-1 text-sm text-[#6B6F8E]">
                {selectedAnalysis.matchSummary || "Use AI to generate role-specific rewrite suggestions for this saved analysis."}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-[#FF8FA3]/20 bg-[#FF8FA3]/5 p-3 text-sm text-[#6B6F8E]">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-[#6B6F8E]">Current ATS Score</span>
              <Target className="h-4 w-4 text-[#6B6F8E]" />
            </div>
            <div className="mb-3 flex items-end gap-2">
              <span className="text-4xl font-bold text-[#E87BF1]">{currentAtsScore}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#3C4166]/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4]"
                style={{ width: `${currentAtsScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-[#6B6F8E]">Potential Score</span>
              <Zap className="h-4 w-4 text-[#4FA7A7]" />
            </div>
            <div className="mb-3 flex items-end gap-2">
              <span className="text-4xl font-bold text-[#4FA7A7]">{potentialScore}%</span>
              <span className="mb-1 text-sm text-[#4FA7A7]">
                +{Math.max(0, potentialScore - currentAtsScore)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#3C4166]/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]"
                style={{ width: `${potentialScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#4FA7A7]/20 bg-gradient-to-br from-[#4FA7A7]/10 to-[#7ED7F7]/10">
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-[#3C4166]">Quick Stats</span>
              <Settings2 className="h-4 w-4 text-[#4FA7A7]" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6F8E]">Bullets to improve</span>
                <span className="font-medium text-[#3C4166]">{bulletsToImprove}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6F8E]">Missing keywords</span>
                <span className="font-medium text-[#FF8FA3]">{missingKeywords}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6F8E]">High-impact changes</span>
                <span className="font-medium text-[#E87BF1]">{highImpactChanges}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!labResult ? (
        <Card className="border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4FA7A7]/20 to-[#E87BF1]/20">
              <Sparkles className="h-6 w-6 text-[#4FA7A7]" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-[#3C4166]">
              Generate Resume Lab suggestions
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-sm text-[#6B6F8E]">
              Choose a saved role and let Kestrel generate AI-backed resume rewrites, ATS keywords, and stronger framing suggestions tailored to that target.
            </p>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedAnalysis || !savedProfile?.resumeText}
              className="bg-[#4FA7A7] text-white hover:bg-[#4FA7A7]/90"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Suggestions"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F7C7D4]/50 to-[#E87BF1]/20">
                      <FileText className="h-5 w-5 text-[#E87BF1]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#3C4166]">Bullet Optimization</CardTitle>
                      <CardDescription className="text-[#6B6F8E]">
                        Side-by-side before and after
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[#3C4166]/10 bg-[#F6F1E7]/50 p-1">
                    {(["all", "experience", "skills"] as const).map((section) => (
                      <button
                        key={section}
                        onClick={() => setSelectedSection(section)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all",
                          selectedSection === section
                            ? "bg-white text-[#3C4166] shadow-sm"
                            : "text-[#6B6F8E] hover:text-[#3C4166]"
                        )}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {filteredBullets.map((bullet) => {
                  const isExpanded = expandedBullets.includes(bullet.id)

                  return (
                    <div
                      key={bullet.id}
                      className={cn(
                        "overflow-hidden rounded-xl border transition-all",
                        bullet.status === "needs-improvement"
                          ? "border-[#FF8FA3]/30 bg-[#FF8FA3]/5"
                          : "border-[#4FA7A7]/30 bg-[#4FA7A7]/5"
                      )}
                    >
                      <button
                        onClick={() => toggleExpanded(bullet.id)}
                        className="w-full p-4 text-left transition-colors hover:bg-white/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {bullet.status === "needs-improvement" ? (
                              <AlertCircle className="h-5 w-5 text-[#FF8FA3]" />
                            ) : (
                              <CheckCircle2 className="h-5 w-5 text-[#4FA7A7]" />
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[#3C4166]">{bullet.company}</span>
                                <span className="rounded-full bg-[#3C4166]/10 px-2 py-0.5 text-xs text-[#6B6F8E]">
                                  {bullet.role}
                                </span>
                              </div>
                              <p className="mt-0.5 line-clamp-1 text-sm text-[#6B6F8E]">
                                {bullet.original}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs",
                                bullet.impact === "critical"
                                  ? "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                                  : bullet.impact === "high"
                                    ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                                    : "bg-[#3C4166]/10 text-[#6B6F8E]"
                              )}
                            >
                              {bullet.impact} impact
                            </span>

                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-[#6B6F8E]" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-[#6B6F8E]" />
                            )}
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="space-y-4 px-4 pb-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-xl border border-[#FF8FA3]/20 bg-[#FF8FA3]/10 p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="text-xs font-medium text-[#FF8FA3]">BEFORE</span>
                              </div>
                              <p className="text-sm text-[#3C4166]">{bullet.original}</p>
                            </div>

                            <div className="rounded-xl border border-[#4FA7A7]/20 bg-[#4FA7A7]/10 p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="text-xs font-medium text-[#4FA7A7]">AFTER</span>
                                <Sparkles className="h-3 w-3 text-[#4FA7A7]" />
                              </div>
                              <p className="text-sm font-medium text-[#3C4166]">{bullet.optimized}</p>
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-[#6B6F8E]">
                              Keywords added
                            </span>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {bullet.keywords.map((keyword) => (
                                <span
                                  key={`${bullet.id}-${keyword}`}
                                  className="rounded-full bg-[#C9B6E4]/20 px-2 py-0.5 text-xs text-[#6B6F8E]"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(bullet.optimized, bullet.id)}
                              className="border-[#4FA7A7] text-[#4FA7A7] hover:bg-[#4FA7A7]/10"
                            >
                              {copiedId === bullet.id ? (
                                <>
                                  <Check className="mr-1.5 h-3.5 w-3.5" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                                  Copy Optimized
                                </>
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerateBullet(bullet)}
                              disabled={regeneratingBulletId === bullet.id}
                              className="text-[#6B6F8E] hover:text-[#3C4166]"
                            >
                              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                              {regeneratingBulletId === bullet.id ? "Regenerating..." : "Regenerate"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7ED7F7]/30 to-[#4FA7A7]/20">
                    <Lightbulb className="h-5 w-5 text-[#4FA7A7]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">Framing Tips</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">
                      Best practices for stronger bullets
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {(labResult.framingSuggestions.length > 0
                    ? labResult.framingSuggestions
                    : defaultFramingSuggestions
                  ).map((tip) => (
                    <div
                      key={tip.title}
                      className="rounded-xl border border-[#3C4166]/5 bg-[#F6F1E7]/50 p-4"
                    >
                      <h4 className="mb-1 font-medium text-[#3C4166]">{tip.title}</h4>
                      <p className="mb-2 text-sm text-[#6B6F8E]">{tip.description}</p>
                      <p className="rounded-lg bg-[#4FA7A7]/10 px-2 py-1 text-xs text-[#4FA7A7]">
                        {tip.example}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9B6E4]/30 to-[#E87BF1]/20">
                    <Target className="h-5 w-5 text-[#E87BF1]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">ATS Keywords</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">
                      For your selected role
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {labResult.keywordSuggestions.map((keyword) => (
                  <div
                    key={keyword.keyword}
                    className={cn(
                      "rounded-xl border p-3",
                      keyword.status === "missing"
                        ? "border-[#FF8FA3]/20 bg-[#FF8FA3]/5"
                        : keyword.status === "partial"
                          ? "border-[#E87BF1]/20 bg-[#E87BF1]/5"
                          : "border-[#4FA7A7]/20 bg-[#C8F5DF]/20"
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {keyword.status === "present" ? (
                          <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                        ) : keyword.status === "partial" ? (
                          <AlertCircle className="h-4 w-4 text-[#E87BF1]" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-[#FF8FA3]" />
                        )}
                        <span className="font-medium text-[#3C4166]">{keyword.keyword}</span>
                      </div>

                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          keyword.importance === "Critical"
                            ? "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                            : keyword.importance === "High"
                              ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                              : "bg-[#3C4166]/10 text-[#6B6F8E]"
                        )}
                      >
                        {keyword.importance}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B6F8E]">{keyword.context}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-[#4FA7A7]/20 bg-gradient-to-br from-[#4FA7A7]/10 to-[#7ED7F7]/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="mb-2 font-semibold text-[#3C4166]">ATS Alignment</h3>
                  <p className="mb-4 text-sm text-[#6B6F8E]">
                    Your resume matches <strong className="text-[#4FA7A7]">{currentAtsScore}%</strong> now and could reach{" "}
                    <strong className="text-[#4FA7A7]">{potentialScore}%</strong> with these changes.
                  </p>

                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#4FA7A7]">
                        {labResult.keywordSuggestions.filter((item) => item.status === "present").length}
                      </p>
                      <p className="text-xs text-[#6B6F8E]">Matched</p>
                    </div>

                    <div className="h-8 w-px bg-[#3C4166]/10" />

                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#FF8FA3]">
                        {labResult.keywordSuggestions.filter((item) => item.status === "missing").length}
                      </p>
                      <p className="text-xs text-[#6B6F8E]">Missing</p>
                    </div>

                    <div className="h-8 w-px bg-[#3C4166]/10" />

                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#E87BF1]">
                        {labResult.keywordSuggestions.filter((item) => item.status === "partial").length}
                      </p>
                      <p className="text-xs text-[#6B6F8E]">Partial</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4] text-white">
              <CardContent className="pt-6 text-center">
                <Sparkles className="mx-auto mb-3 h-8 w-8 opacity-90" />
                <h3 className="mb-2 font-semibold">Apply all optimizations?</h3>
                <p className="mb-4 text-sm text-white/80">
                  Export the optimized version or copy individual bullets into your resume.
                </p>
                <Button
                  onClick={handleExportOptimized}
                  className="w-full rounded-full bg-white text-[#E87BF1] hover:bg-white/90"
                >
                  Apply All Changes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}