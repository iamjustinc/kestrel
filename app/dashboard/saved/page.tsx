"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  Grid3X3,
  List,
  ArrowUpDown,
  Building2,
  Trash2,
  CheckSquare,
  Square,
  GitCompare,
  ExternalLink,
  Star,
  Clock,
  X,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type SavedAnalysisDetails = {
  role?: string
  company?: string
  readinessScore?: number
  confidenceLevel?: string
  atsScore?: number
  analyzedAt?: string
  matchSummary?: string
  strengths?: Array<{
    skill?: string
    level?: string
    evidence?: string
  }>
  skillGaps?: {
    technical?: Array<{ skill?: string; importance?: string; suggestion?: string }>
    productBusiness?: Array<{ skill?: string; importance?: string; suggestion?: string }>
    communication?: Array<{ skill?: string; importance?: string; suggestion?: string }>
    toolsPlatforms?: Array<{ skill?: string; importance?: string; suggestion?: string }>
  }
  atsKeywords?: {
    matched?: string[]
    missing?: string[]
    score?: number
  }
  marketSignals?: {
    themes?: string[]
    expectations?: string[]
    salaryRange?: string
    demandLevel?: string
  }
  nextSteps?: {
    now?: Array<{ action?: string }>
    soon?: Array<{ action?: string }>
    later?: Array<{ action?: string }>
  }
}

type SavedAnalysisItem = {
  id: string
  role: string
  company: string
  readinessScore: number
  atsScore: number
  savedAt: string
  matchSummary?: string
  confidenceLevel?: string
  analysis?: SavedAnalysisDetails
  createdAt: string
  tags: string[]
  favorite: boolean
  status: string
}

const roleTypes = ["All", "PM", "SE", "Growth", "Technical"]
const sortOptions = ["Recent", "Score: High to Low", "Score: Low to High", "Company A-Z"]

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

function formatSavedTime(value: string) {
  try {
    const date = new Date(value)
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  } catch {
    return "Recently"
  }
}

function inferTags(item: {
  role: string
  company: string
  analysis?: SavedAnalysisDetails
}) {
  const tags: string[] = []
  const role = item.role.toLowerCase()
  const company = item.company

  if (
    role.includes("product manager") ||
    role.includes("project manager") ||
    role.includes("program manager") ||
    role.includes("pm")
  ) {
    tags.push("PM")
  }

  if (
    role.includes("solution engineer") ||
    role.includes("solutions engineer") ||
    role.includes("sales engineer") ||
    role.includes("solutions consultant")
  ) {
    tags.push("SE")
  }

  if (role.includes("growth")) {
    tags.push("Growth")
  }

  if (
    role.includes("technical") ||
    role.includes("engineer") ||
    role.includes("developer") ||
    role.includes("architect") ||
    role.includes("data")
  ) {
    tags.push("Technical")
  }

  const themes = asStringArray(item.analysis?.marketSignals?.themes).map((theme) =>
    theme.toLowerCase()
  )

  if (!tags.includes("Growth") && themes.some((theme) => theme.includes("growth"))) {
    tags.push("Growth")
  }

  if (company && company !== "Unknown") {
    tags.push(company)
  }

  return tags.slice(0, 4)
}

function inferStatus(score: number) {
  if (score >= 75) return "strong-match"
  if (score >= 60) return "good-match"
  return "needs-work"
}

function getStatusColor(status: string) {
  switch (status) {
    case "strong-match":
      return "from-[#4FA7A7] to-[#7ED7F7]"
    case "good-match":
      return "from-[#E87BF1] to-[#C9B6E4]"
    case "needs-work":
      return "from-[#FF8FA3] to-[#F7C7D4]"
    default:
      return "from-[#3C4166]/20 to-[#3C4166]/10"
  }
}

function normalizeSavedAnalysis(item: any): SavedAnalysisItem {
  const analysis =
    item?.analysis && typeof item.analysis === "object" ? item.analysis : item

  const role = asString(item?.role ?? analysis?.role, "Target Role")
  const company = asString(item?.company ?? analysis?.company, "Unknown")
  const readinessScore = clampPercent(
    item?.readinessScore ?? analysis?.readinessScore,
    0
  )
  const atsScore = clampPercent(item?.atsScore ?? analysis?.atsScore ?? analysis?.atsKeywords?.score, 0)
  const savedAt = asString(item?.savedAt, new Date().toISOString())

  const normalizedAnalysis: SavedAnalysisDetails = {
    ...analysis,
    role,
    company,
    readinessScore,
    atsScore,
    confidenceLevel: asString(analysis?.confidenceLevel, "Medium"),
    matchSummary: asString(analysis?.matchSummary, ""),
    atsKeywords: {
      matched: asStringArray(analysis?.atsKeywords?.matched),
      missing: asStringArray(analysis?.atsKeywords?.missing),
      score: atsScore,
    },
  }

  return {
    id: asString(item?.id, `analysis_${Date.now()}`),
    role,
    company,
    readinessScore,
    atsScore,
    savedAt,
    matchSummary: asString(item?.matchSummary ?? analysis?.matchSummary, ""),
    confidenceLevel: asString(
      item?.confidenceLevel ?? analysis?.confidenceLevel,
      "Medium"
    ),
    analysis: normalizedAnalysis,
    createdAt: formatSavedTime(savedAt),
    tags: inferTags({
      role,
      company,
      analysis: normalizedAnalysis,
    }),
    favorite: false,
    status: inferStatus(readinessScore),
  }
}

function getAllGapSkills(analysis?: SavedAnalysisDetails) {
  if (!analysis?.skillGaps) return []

  const buckets = [
    ...(analysis.skillGaps.technical ?? []),
    ...(analysis.skillGaps.productBusiness ?? []),
    ...(analysis.skillGaps.communication ?? []),
    ...(analysis.skillGaps.toolsPlatforms ?? []),
  ]

  return buckets
    .map((item) => asString(item?.skill, ""))
    .filter(Boolean)
}

function getCommonItems(selected: SavedAnalysisItem[], getter: (item: SavedAnalysisItem) => string[]) {
  const counts = new Map<string, number>()

  selected.forEach((item) => {
    const uniqueValues = Array.from(new Set(getter(item).map((value) => value.trim()).filter(Boolean)))
    uniqueValues.forEach((value) => {
      counts.set(value, (counts.get(value) ?? 0) + 1)
    })
  })

  return Array.from(counts.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value]) => value)
}

function getUniqueItemsForCard(
  current: SavedAnalysisItem,
  selected: SavedAnalysisItem[],
  getter: (item: SavedAnalysisItem) => string[]
) {
  const otherValues = new Set(
    selected
      .filter((item) => item.id !== current.id)
      .flatMap((item) => getter(item))
      .map((value) => value.trim())
      .filter(Boolean)
  )

  return getter(current).filter((value) => value && !otherValues.has(value)).slice(0, 3)
}

export default function SavedAnalysesPage() {
  const router = useRouter()

  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoleType, setSelectedRoleType] = useState("All")
  const [sortBy, setSortBy] = useState("Recent")
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([])
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysisItem[]>([])
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  useEffect(() => {
    const loadSavedAnalyses = () => {
      try {
        const raw = window.localStorage.getItem("kestrel_saved_analyses")
        const parsed = raw ? JSON.parse(raw) : []

        const normalized = Array.isArray(parsed)
          ? parsed.map(normalizeSavedAnalysis)
          : []

        setSavedAnalyses(normalized)
      } catch (error) {
        console.error("Failed to load saved analyses:", error)
        setSavedAnalyses([])
      }
    }

    loadSavedAnalyses()

    window.addEventListener("storage", loadSavedAnalyses)
    window.addEventListener("focus", loadSavedAnalyses)
    window.addEventListener("kestrel-saved-analyses-updated", loadSavedAnalyses)

    return () => {
      window.removeEventListener("storage", loadSavedAnalyses)
      window.removeEventListener("focus", loadSavedAnalyses)
      window.removeEventListener("kestrel-saved-analyses-updated", loadSavedAnalyses)
    }
  }, [])

  const filteredAnalyses = useMemo(() => {
    const base = savedAnalyses
      .filter((analysis) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()

        return (
          analysis.role.toLowerCase().includes(query) ||
          analysis.company.toLowerCase().includes(query) ||
          analysis.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (analysis.matchSummary ?? "").toLowerCase().includes(query)
        )
      })
      .filter((analysis) => {
        if (selectedRoleType === "All") return true
        return analysis.tags.includes(selectedRoleType)
      })

    const next = [...base]

    if (sortBy === "Score: High to Low") {
      next.sort((a, b) => b.readinessScore - a.readinessScore || b.atsScore - a.atsScore)
    } else if (sortBy === "Score: Low to High") {
      next.sort((a, b) => a.readinessScore - b.readinessScore || a.atsScore - b.atsScore)
    } else if (sortBy === "Company A-Z") {
      next.sort((a, b) => a.company.localeCompare(b.company) || a.role.localeCompare(b.role))
    } else {
      next.sort(
        (a, b) =>
          new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      )
    }

    return next
  }, [savedAnalyses, searchQuery, selectedRoleType, sortBy])

  const selectedAnalyses = useMemo(
    () =>
      savedAnalyses.filter((analysis) =>
        selectedForCompare.includes(analysis.id)
      ),
    [savedAnalyses, selectedForCompare]
  )

  const cycleSort = () => {
    const currentIndex = sortOptions.indexOf(sortBy)
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % sortOptions.length
    setSortBy(sortOptions[nextIndex])
  }

  const toggleCompareSelection = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare((prev) => prev.filter((item) => item !== id))
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare((prev) => [...prev, id])
    }
  }

  const handleOpenAnalysis = (analysis: SavedAnalysisItem) => {
    const payload = analysis.analysis ?? analysis
    window.localStorage.setItem("kestrel_last_analysis", JSON.stringify(payload))
    router.push("/dashboard/analysis/results")
  }

  const handleDiscardAnalysis = (id: string) => {
    try {
      const nextSaved = savedAnalyses.filter((analysis) => analysis.id !== id)
      setSavedAnalyses(nextSaved)
      setSelectedForCompare((prev) => prev.filter((item) => item !== id))

      window.localStorage.setItem(
        "kestrel_saved_analyses",
        JSON.stringify(
          nextSaved.map((analysis) => ({
            id: analysis.id,
            savedAt: analysis.savedAt,
            role: analysis.role,
            company: analysis.company,
            readinessScore: analysis.readinessScore,
            confidenceLevel: analysis.confidenceLevel,
            atsScore: analysis.atsScore,
            matchSummary: analysis.matchSummary,
            analysis: analysis.analysis,
          }))
        )
      )

      window.dispatchEvent(new Event("kestrel-saved-analyses-updated"))
    } catch (error) {
      console.error("Failed to discard saved analysis:", error)
      window.alert("Could not discard this saved analysis.")
    }
  }

  const handleCompareSelected = () => {
    if (selectedAnalyses.length < 2) return
    setIsCompareOpen(true)
  }

  return (
    <div className="pb-20 lg:pb-0">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#3C4166] sm:text-3xl">
            Saved Analyses
          </h1>
          <p className="mt-1 text-[#6B6F8E]">
            {savedAnalyses.length} analyses saved
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={compareMode ? "default" : "outline"}
            onClick={() => {
              setCompareMode(!compareMode)
              setSelectedForCompare([])
              setIsCompareOpen(false)
            }}
            className={cn(
              compareMode
                ? "bg-[#4FA7A7] text-white hover:bg-[#4FA7A7]/90"
                : "border-[#3C4166]/15 text-[#3C4166]"
            )}
          >
            <GitCompare className="mr-2 h-4 w-4" />
            {compareMode ? "Exit Compare" : "Compare"}
          </Button>

          <Link href="/dashboard/analysis">
            <Button className="bg-[#4FA7A7] text-white hover:bg-[#4FA7A7]/90">
              New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {compareMode && (
        <Card className="mb-6 border-[#4FA7A7]/20 bg-gradient-to-r from-[#4FA7A7]/10 to-[#7ED7F7]/10">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitCompare className="h-5 w-5 text-[#4FA7A7]" />
                <span className="text-sm text-[#3C4166]">
                  Select up to 3 analyses to compare. <strong>{selectedForCompare.length}/3</strong> selected.
                </span>
              </div>

              {selectedForCompare.length >= 2 && (
                <Button
                  size="sm"
                  onClick={handleCompareSelected}
                  className="bg-[#4FA7A7] text-white hover:bg-[#4FA7A7]/90"
                >
                  Compare Selected
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6F8E]" />
          <input
            type="text"
            placeholder="Search by role, company, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-[#3C4166]/10 bg-white/50 pl-10 pr-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#3C4166]/10 bg-white/50 p-1">
          {roleTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedRoleType(type)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                selectedRoleType === type
                  ? "bg-[#4FA7A7] text-white"
                  : "text-[#6B6F8E] hover:text-[#3C4166]"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={cycleSort}
            className="border-[#3C4166]/15 text-[#6B6F8E]"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortBy}
          </Button>

          <div className="flex items-center rounded-xl border border-[#3C4166]/10 bg-white/50 p-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "rounded-lg p-2 transition-all",
                view === "grid" ? "bg-[#4FA7A7] text-white" : "text-[#6B6F8E]"
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "rounded-lg p-2 transition-all",
                view === "list" ? "bg-[#4FA7A7] text-white" : "text-[#6B6F8E]"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredAnalyses.length === 0 ? (
        <EmptyState searchQuery={searchQuery} />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAnalyses.map((analysis) => (
            <AnalysisCard
              key={analysis.id}
              analysis={analysis}
              compareMode={compareMode}
              isSelected={selectedForCompare.includes(analysis.id)}
              onSelect={() => toggleCompareSelection(analysis.id)}
              onOpen={() => handleOpenAnalysis(analysis)}
              onDiscard={() => handleDiscardAnalysis(analysis.id)}
              statusColor={getStatusColor(analysis.status)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnalyses.map((analysis) => (
            <AnalysisRow
              key={analysis.id}
              analysis={analysis}
              compareMode={compareMode}
              isSelected={selectedForCompare.includes(analysis.id)}
              onSelect={() => toggleCompareSelection(analysis.id)}
              onOpen={() => handleOpenAnalysis(analysis)}
              onDiscard={() => handleDiscardAnalysis(analysis.id)}
              statusColor={getStatusColor(analysis.status)}
            />
          ))}
        </div>
      )}

      {isCompareOpen && selectedAnalyses.length >= 2 && (
        <CompareOverlay
          analyses={selectedAnalyses}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </div>
  )
}

function AnalysisCard({
  analysis,
  compareMode,
  isSelected,
  onSelect,
  onOpen,
  onDiscard,
  statusColor,
}: {
  analysis: SavedAnalysisItem
  compareMode: boolean
  isSelected: boolean
  onSelect: () => void
  onOpen: () => void
  onDiscard: () => void
  statusColor: string
}) {
  return (
    <Card
      className={cn(
        "group border-[#3C4166]/10 bg-white/70 backdrop-blur-sm transition-all hover:shadow-md",
        isSelected && "ring-2 ring-[#4FA7A7]"
      )}
    >
      <CardContent className="pt-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {compareMode ? (
              <button onClick={onSelect} className="flex-shrink-0">
                {isSelected ? (
                  <CheckSquare className="h-5 w-5 text-[#4FA7A7]" />
                ) : (
                  <Square className="h-5 w-5 text-[#6B6F8E]" />
                )}
              </button>
            ) : (
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br",
                  statusColor
                )}
              >
                <span className="text-sm font-bold text-white">
                  {analysis.readinessScore}
                </span>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-[#3C4166]">{analysis.role}</h3>
              <div className="flex items-center gap-1 text-sm text-[#6B6F8E]">
                <Building2 className="h-3.5 w-3.5" />
                {analysis.company}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {analysis.favorite && (
              <Star className="h-4 w-4 fill-[#E87BF1] text-[#E87BF1]" />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onDiscard}
              className="h-8 w-8 text-[#6B6F8E] opacity-0 transition-opacity group-hover:opacity-100"
              title="Discard saved analysis"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#F6F1E7]/50 p-3">
            <p className="mb-1 text-xs text-[#6B6F8E]">Readiness</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#3C4166]/10">
                <div
                  className={cn("h-full rounded-full bg-gradient-to-r", statusColor)}
                  style={{ width: `${analysis.readinessScore}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[#3C4166]">
                {analysis.readinessScore}%
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-[#F6F1E7]/50 p-3">
            <p className="mb-1 text-xs text-[#6B6F8E]">ATS Score</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#3C4166]/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]"
                  style={{ width: `${analysis.atsScore}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[#3C4166]">
                {analysis.atsScore}%
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {analysis.tags.slice(0, 3).map((tag) => (
            <span
              key={`${analysis.id}-${tag}`}
              className="rounded-full bg-[#C9B6E4]/12 px-2 py-0.5 text-xs text-[#6B6F8E]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="border-t border-[#3C4166]/10 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-[#6B6F8E]">
              <Clock className="h-3.5 w-3.5" />
              {analysis.createdAt}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDiscard}
                className="text-[#6B6F8E] hover:bg-[#FF8FA3]/10 hover:text-[#FF8FA3]"
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Discard
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onOpen}
                className="text-[#4FA7A7] hover:bg-[#4FA7A7]/10 hover:text-[#4FA7A7]"
              >
                View Results
                <ExternalLink className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AnalysisRow({
  analysis,
  compareMode,
  isSelected,
  onSelect,
  onOpen,
  onDiscard,
  statusColor,
}: {
  analysis: SavedAnalysisItem
  compareMode: boolean
  isSelected: boolean
  onSelect: () => void
  onOpen: () => void
  onDiscard: () => void
  statusColor: string
}) {
  return (
    <Card
      className={cn(
        "border-[#3C4166]/10 bg-white/70 backdrop-blur-sm transition-all hover:shadow-sm",
        isSelected && "ring-2 ring-[#4FA7A7]"
      )}
    >
      <CardContent className="py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            {compareMode ? (
              <button onClick={onSelect} className="flex-shrink-0">
                {isSelected ? (
                  <CheckSquare className="h-5 w-5 text-[#4FA7A7]" />
                ) : (
                  <Square className="h-5 w-5 text-[#6B6F8E]" />
                )}
              </button>
            ) : (
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br",
                  statusColor
                )}
              >
                <span className="text-sm font-bold text-white">
                  {analysis.readinessScore}
                </span>
              </div>
            )}

            <div className="min-w-[220px]">
              <h3 className="font-semibold text-[#3C4166]">{analysis.role}</h3>
              <div className="flex items-center gap-1 text-sm text-[#6B6F8E]">
                <Building2 className="h-3.5 w-3.5" />
                {analysis.company}
              </div>
            </div>

            <div className="grid min-w-[250px] grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#F6F1E7]/50 p-3">
                <p className="mb-1 text-xs text-[#6B6F8E]">Readiness</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#3C4166]/10">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r", statusColor)}
                      style={{ width: `${analysis.readinessScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-[#3C4166]">
                    {analysis.readinessScore}%
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-[#F6F1E7]/50 p-3">
                <p className="mb-1 text-xs text-[#6B6F8E]">ATS Score</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#3C4166]/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]"
                      style={{ width: `${analysis.atsScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-[#3C4166]">
                    {analysis.atsScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <div className="flex items-center gap-1 text-sm text-[#6B6F8E]">
              <Clock className="h-3.5 w-3.5" />
              {analysis.createdAt}
            </div>

            <div className="flex flex-wrap gap-2">
              {analysis.tags.slice(0, 3).map((tag) => (
                <span
                  key={`${analysis.id}-${tag}`}
                  className="rounded-full bg-[#C9B6E4]/12 px-2 py-0.5 text-xs text-[#6B6F8E]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDiscard}
              className="text-[#6B6F8E] hover:bg-[#FF8FA3]/10 hover:text-[#FF8FA3]"
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Discard
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onOpen}
              className="text-[#4FA7A7] hover:bg-[#4FA7A7]/10 hover:text-[#4FA7A7]"
            >
              View Results
              <ExternalLink className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <Card className="border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
      <CardContent className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4FA7A7]/20 to-[#E87BF1]/20">
          <Search className="h-6 w-6 text-[#4FA7A7]" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[#3C4166]">
          No saved analyses found
        </h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-[#6B6F8E]">
          {searchQuery
            ? "Try changing your search or category filter."
            : "Run an analysis and save it to see it here."}
        </p>
        <Link href="/dashboard/analysis">
          <Button className="bg-[#4FA7A7] text-white hover:bg-[#4FA7A7]/90">
            New Analysis
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function CompareOverlay({
  analyses,
  onClose,
}: {
  analyses: SavedAnalysisItem[]
  onClose: () => void
}) {
  const commonMissingKeywords = getCommonItems(analyses, (item) =>
    asStringArray(item.analysis?.atsKeywords?.missing)
  ).slice(0, 6)

  const commonGapSkills = getCommonItems(analyses, (item) =>
    getAllGapSkills(item.analysis)
  ).slice(0, 6)

  const commonThemes = getCommonItems(analyses, (item) =>
    asStringArray(item.analysis?.marketSignals?.themes)
  ).slice(0, 6)

  const topPriorityRoles = [...analyses]
    .sort((a, b) => a.readinessScore - b.readinessScore || a.atsScore - b.atsScore)
    .slice(0, 3)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3C4166]/35 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-[#3C4166]/10 bg-[#F6F1E7] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#3C4166]/10 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[#3C4166]">
              Compare Saved Analyses
            </h2>
            <p className="mt-1 text-sm text-[#6B6F8E]">
              Overlap, highest-priority roles, and what is similar or different
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose} className="text-[#6B6F8E]">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="max-h-[calc(90vh-76px)] overflow-y-auto px-6 py-6">
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="border-[#3C4166]/10 bg-white/70">
              <CardContent className="pt-5">
                <h3 className="mb-3 font-semibold text-[#3C4166]">
                  Highest Priority
                </h3>
                <div className="space-y-3">
                  {topPriorityRoles.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-[#F6F1E7]/50 p-3"
                    >
                      <div className="font-medium text-[#3C4166]">
                        {item.role}
                      </div>
                      <div className="text-sm text-[#6B6F8E]">
                        {item.company}
                      </div>
                      <div className="mt-2 flex gap-4 text-xs text-[#6B6F8E]">
                        <span>Readiness {item.readinessScore}%</span>
                        <span>ATS {item.atsScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#3C4166]/10 bg-white/70">
              <CardContent className="pt-5">
                <h3 className="mb-3 font-semibold text-[#3C4166]">
                  Shared Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {commonMissingKeywords.length > 0 ? (
                    commonMissingKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-[#FF8FA3]/12 px-2.5 py-1 text-xs text-[#6B6F8E]"
                      >
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#6B6F8E]">
                      No strong keyword overlap found.
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#3C4166]/10 bg-white/70">
              <CardContent className="pt-5">
                <h3 className="mb-3 font-semibold text-[#3C4166]">
                  Shared Gap Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {commonGapSkills.length > 0 ? (
                    commonGapSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[#E87BF1]/12 px-2.5 py-1 text-xs text-[#6B6F8E]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#6B6F8E]">
                      No repeated gap areas across these roles.
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 border-[#3C4166]/10 bg-white/70">
            <CardContent className="pt-5">
              <h3 className="mb-3 font-semibold text-[#3C4166]">Shared Themes</h3>
              <div className="flex flex-wrap gap-2">
                {commonThemes.length > 0 ? (
                  commonThemes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full bg-[#4FA7A7]/12 px-2.5 py-1 text-xs text-[#6B6F8E]"
                    >
                      {theme}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[#6B6F8E]">
                    No major market-theme overlap was returned in these analyses.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {analyses.map((analysis) => {
              const uniqueMissing = getUniqueItemsForCard(
                analysis,
                analyses,
                (item) => asStringArray(item.analysis?.atsKeywords?.missing)
              )

              const uniqueGaps = getUniqueItemsForCard(
                analysis,
                analyses,
                (item) => getAllGapSkills(item.analysis)
              )

              const statusColor = getStatusColor(analysis.status)

              return (
                <Card key={analysis.id} className="border-[#3C4166]/10 bg-white/70">
                  <CardContent className="pt-5">
                    <div className="mb-4 flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br",
                          statusColor
                        )}
                      >
                        <span className="text-sm font-bold text-white">
                          {analysis.readinessScore}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#3C4166]">
                          {analysis.role}
                        </h3>
                        <div className="text-sm text-[#6B6F8E]">
                          {analysis.company}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#F6F1E7]/50 p-3">
                        <p className="mb-1 text-xs text-[#6B6F8E]">Readiness</p>
                        <p className="text-lg font-semibold text-[#3C4166]">
                          {analysis.readinessScore}%
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#F6F1E7]/50 p-3">
                        <p className="mb-1 text-xs text-[#6B6F8E]">ATS Score</p>
                        <p className="text-lg font-semibold text-[#3C4166]">
                          {analysis.atsScore}%
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="mb-2 text-sm font-medium text-[#3C4166]">
                        Similar to Others
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {commonMissingKeywords.slice(0, 3).map((item) => (
                          <span
                            key={`${analysis.id}-similar-${item}`}
                            className="rounded-full bg-[#C9B6E4]/12 px-2 py-0.5 text-xs text-[#6B6F8E]"
                          >
                            {item}
                          </span>
                        ))}
                        {commonMissingKeywords.length === 0 && (
                          <span className="text-xs text-[#6B6F8E]">
                            Limited overlap
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="mb-2 text-sm font-medium text-[#3C4166]">
                        Different / Unique
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {uniqueMissing.slice(0, 2).map((item) => (
                          <span
                            key={`${analysis.id}-unique-missing-${item}`}
                            className="rounded-full bg-[#FF8FA3]/12 px-2 py-0.5 text-xs text-[#6B6F8E]"
                          >
                            {item}
                          </span>
                        ))}
                        {uniqueGaps.slice(0, 2).map((item) => (
                          <span
                            key={`${analysis.id}-unique-gap-${item}`}
                            className="rounded-full bg-[#7ED7F7]/12 px-2 py-0.5 text-xs text-[#6B6F8E]"
                          >
                            {item}
                          </span>
                        ))}
                        {uniqueMissing.length === 0 && uniqueGaps.length === 0 && (
                          <span className="text-xs text-[#6B6F8E]">
                            No standout unique items
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-medium text-[#3C4166]">
                        Summary
                      </p>
                      <p className="text-sm leading-relaxed text-[#6B6F8E]">
                        {analysis.matchSummary || "No summary saved for this analysis."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}