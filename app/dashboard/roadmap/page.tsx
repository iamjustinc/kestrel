"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Target,
  BookOpen,
  Briefcase,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Star,
  AlertCircle,
  FileText,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

type GapItem = {
  skill?: string
  importance?: string
  currentLevel?: number
  suggestion?: string
}

type NextStepItem = {
  action?: string
  effort?: string
  impact?: string
}

type SavedAnalysisDetails = {
  role?: string
  company?: string
  readinessScore?: number
  confidenceLevel?: string
  atsScore?: number
  analyzedAt?: string
  matchSummary?: string
  skillGaps?: {
    technical?: GapItem[]
    productBusiness?: GapItem[]
    communication?: GapItem[]
    toolsPlatforms?: GapItem[]
  }
  nextSteps?: {
    now?: NextStepItem[]
    soon?: NextStepItem[]
    later?: NextStepItem[]
  }
}

type SavedAnalysisItem = {
  id: string
  role: string
  company: string
  readinessScore: number
  atsScore: number
  savedAt: string
  analysis?: SavedAnalysisDetails
}

type ResourceItem = {
  title: string
  url: string
  internal?: boolean
}

type RoadmapSubtask = {
  title: string
}

type RoadmapItem = {
  id: number
  title: string
  description: string
  category: "Quick Win" | "Learning" | "Project" | "Documentation" | "Certification"
  timeEstimate: string
  skillTarget: string
  priority: "critical" | "high" | "medium" | "low"
  subtasks: RoadmapSubtask[]
  resources: ResourceItem[]
}

type RoadmapBuckets = {
  now: RoadmapItem[]
  soon: RoadmapItem[]
  later: RoadmapItem[]
}

const categoryIcons: Record<RoadmapItem["category"], typeof BookOpen> = {
  "Quick Win": Zap,
  Learning: BookOpen,
  Project: Briefcase,
  Documentation: Target,
  Certification: Award,
}

const categoryColors: Record<RoadmapItem["category"], string> = {
  "Quick Win": "from-[#4FA7A7] to-[#7ED7F7]",
  Learning: "from-[#E87BF1] to-[#C9B6E4]",
  Project: "from-[#F7C7D4] to-[#FF8FA3]",
  Documentation: "from-[#7ED7F7] to-[#4FA7A7]",
  Certification: "from-[#C8F5DF] to-[#4FA7A7]",
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

function normalizeSavedAnalysis(item: any): SavedAnalysisItem {
  const analysis =
    item?.analysis && typeof item.analysis === "object" ? item.analysis : item

  return {
    id: asString(item?.id, `analysis_${Date.now()}`),
    role: asString(item?.role ?? analysis?.role, "Target Role"),
    company: asString(item?.company ?? analysis?.company, "Unknown"),
    readinessScore: clampPercent(item?.readinessScore ?? analysis?.readinessScore, 0),
    atsScore: clampPercent(item?.atsScore ?? analysis?.atsScore ?? analysis?.atsKeywords?.score, 0),
    savedAt: asString(item?.savedAt, new Date().toISOString()),
    analysis,
  }
}

function inferCategory(title: string): RoadmapItem["category"] {
  const value = title.toLowerCase()

  if (
    value.includes("cert") ||
    value.includes("certificate") ||
    value.includes("certification")
  ) {
    return "Certification"
  }

  if (
    value.includes("write") ||
    value.includes("document") ||
    value.includes("prd") ||
    value.includes("spec")
  ) {
    return "Documentation"
  }

  if (
    value.includes("build") ||
    value.includes("project") ||
    value.includes("portfolio") ||
    value.includes("ship") ||
    value.includes("create")
  ) {
    return "Project"
  }

  if (
    value.includes("course") ||
    value.includes("learn") ||
    value.includes("complete") ||
    value.includes("study")
  ) {
    return "Learning"
  }

  return "Quick Win"
}

function inferSkillTarget(title: string, fallback = "Career Growth") {
  const value = title.toLowerCase()

  if (value.includes("resume")) return "Resume Optimization"
  if (value.includes("sql")) return "SQL & Data Analysis"
  if (value.includes("analytics")) return "Product Analytics"
  if (value.includes("keyword")) return "ATS Optimization"
  if (value.includes("prd") || value.includes("document")) return "Technical Documentation"
  if (value.includes("cert")) return "Credential Signal"
  if (value.includes("stakeholder")) return "Stakeholder Communication"
  if (value.includes("roadmap")) return "Product Strategy"

  return fallback
}

function inferDescription(title: string, bucket: keyof RoadmapBuckets) {
  if (bucket === "now") {
    return `A high-priority step you can start right away to strengthen your application.`
  }

  if (bucket === "soon") {
    return `A near-term step that will strengthen one of your main gaps for this role.`
  }

  return `A longer-term step to build stronger evidence and deepen your fit over time.`
}

function buildSubtasks(title: string, skillTarget: string): RoadmapSubtask[] {
  const value = title.toLowerCase()

  if (value.includes("resume")) {
    return [
      { title: "Review the current resume section tied to this goal" },
      { title: "Rewrite or strengthen the relevant bullets" },
      { title: "Save the updated version for future applications" },
    ]
  }

  if (value.includes("cert") || value.includes("course")) {
    return [
      { title: "Choose the learning resource or certification path" },
      { title: "Complete the main coursework or preparation" },
      { title: "Add the completion to your resume or profile" },
    ]
  }

  if (value.includes("project") || value.includes("portfolio") || value.includes("build")) {
    return [
      { title: "Define the scope and success criteria" },
      { title: "Complete the core build or project work" },
      { title: "Document the outcome for your portfolio or resume" },
    ]
  }

  return [
    { title: `Clarify what “${title}” means for your target role` },
    { title: `Take one concrete action to strengthen ${skillTarget}` },
    { title: "Save proof of progress in your resume, profile, or portfolio" },
  ]
}

function inferResources(title: string): ResourceItem[] {
  const value = title.toLowerCase()
  const resources: ResourceItem[] = []

  if (value.includes("resume") || value.includes("bullet") || value.includes("keyword")) {
    resources.push({
      title: "Resume Lab",
      url: "/dashboard/resume-lab",
      internal: true,
    })
  }

  if (value.includes("analysis") || value.includes("role") || value.includes("gap")) {
    resources.push({
      title: "Saved Analyses",
      url: "/dashboard/saved",
      internal: true,
    })
  }

  resources.push({
    title: "New Analysis",
    url: "/dashboard/analysis",
    internal: true,
  })

  return resources
}

function buildRoadmapItem(
  id: number,
  step: NextStepItem,
  bucket: keyof RoadmapBuckets,
  fallbackSkill = "Career Growth"
): RoadmapItem | null {
  const title = asString(step?.action, "")
  if (!title) return null

  const timeEstimate = asString(step?.effort, bucket === "now" ? "This week" : "Planned")
  const priority = asString(step?.impact, "medium").toLowerCase()

  const normalizedPriority =
    priority === "critical" ||
    priority === "high" ||
    priority === "medium" ||
    priority === "low"
      ? priority
      : "medium"

  const skillTarget = inferSkillTarget(title, fallbackSkill)

  return {
    id,
    title,
    description: inferDescription(title, bucket),
    category: inferCategory(title),
    timeEstimate,
    skillTarget,
    priority: normalizedPriority,
    subtasks: buildSubtasks(title, skillTarget),
    resources: inferResources(title),
  }
}

function buildFallbackFromGaps(
  gaps: GapItem[] | undefined,
  startId: number,
  bucket: keyof RoadmapBuckets
): RoadmapItem[] {
  if (!Array.isArray(gaps)) return []

  return gaps
    .slice(0, bucket === "now" ? 2 : bucket === "soon" ? 2 : 1)
    .map((gap, index) => {
      const skill = asString(gap?.skill, "Skill")
      const suggestion = asString(gap?.suggestion, `Build stronger evidence in ${skill}.`)
      const priority = asString(gap?.importance, "medium").toLowerCase()

      const title =
        bucket === "now"
          ? `Strengthen ${skill}`
          : bucket === "soon"
            ? `Build more evidence in ${skill}`
            : `Create a longer-term plan for ${skill}`

      return {
        id: startId + index,
        title,
        description: suggestion,
        category: bucket === "later" ? "Project" : "Quick Win",
        timeEstimate: bucket === "now" ? "This week" : bucket === "soon" ? "1-2 weeks" : "2-4 weeks",
        skillTarget: skill,
        priority:
          priority === "critical" ||
          priority === "high" ||
          priority === "medium" ||
          priority === "low"
            ? priority
            : "medium",
        subtasks: buildSubtasks(title, skill),
        resources: inferResources(title),
      } satisfies RoadmapItem
    })
}

function buildRoadmapData(savedAnalysis: SavedAnalysisItem | null): RoadmapBuckets {
  if (!savedAnalysis?.analysis) {
    return {
      now: [],
      soon: [],
      later: [],
    }
  }

  const nextSteps = savedAnalysis.analysis.nextSteps
  const skillGaps = savedAnalysis.analysis.skillGaps

  let nextId = 1

  const now =
    (nextSteps?.now ?? [])
      .map((step) => {
        const item = buildRoadmapItem(nextId, step, "now")
        nextId += 1
        return item
      })
      .filter(Boolean) as RoadmapItem[]

  const soon =
    (nextSteps?.soon ?? [])
      .map((step) => {
        const item = buildRoadmapItem(nextId, step, "soon")
        nextId += 1
        return item
      })
      .filter(Boolean) as RoadmapItem[]

  const later =
    (nextSteps?.later ?? [])
      .map((step) => {
        const item = buildRoadmapItem(nextId, step, "later")
        nextId += 1
        return item
      })
      .filter(Boolean) as RoadmapItem[]

  if (now.length === 0) {
    const fallback = buildFallbackFromGaps(
      [
        ...(skillGaps?.technical ?? []),
        ...(skillGaps?.communication ?? []),
      ],
      nextId,
      "now"
    )
    nextId += fallback.length
    now.push(...fallback)
  }

  if (soon.length === 0) {
    const fallback = buildFallbackFromGaps(
      [
        ...(skillGaps?.productBusiness ?? []),
        ...(skillGaps?.technical ?? []),
      ],
      nextId,
      "soon"
    )
    nextId += fallback.length
    soon.push(...fallback)
  }

  if (later.length === 0) {
    const fallback = buildFallbackFromGaps(
      [
        ...(skillGaps?.toolsPlatforms ?? []),
        ...(skillGaps?.productBusiness ?? []),
      ],
      nextId,
      "later"
    )
    nextId += fallback.length
    later.push(...fallback)
  }

  return { now, soon, later }
}

function getProgressStorageKey(analysisId: string) {
  return `kestrel_roadmap_progress_${analysisId}`
}

function EmptyRoadmapState() {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
      <CardContent className="py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3C4166]/5">
            <AlertCircle className="h-6 w-6 text-[#6B6F8E]" />
          </div>
          <h2 className="text-xl font-semibold text-[#3C4166]">
            It seems empty in here.
          </h2>
          <p className="mt-2 text-sm text-[#6B6F8E]">
            Save a role analysis first and your roadmap will be generated from your real next steps and skill gaps.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/dashboard/analysis">
              <Button className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-full">
                New Analysis
              </Button>
            </Link>
            <Link href="/dashboard/saved">
              <Button variant="outline" className="border-[#3C4166]/15 text-[#3C4166]">
                View Saved Analyses
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function RoadmapPage() {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysisItem[]>([])
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [completedTasks, setCompletedTasks] = useState<{ [key: number]: number[] }>({})

  useEffect(() => {
    try {
      const rawSavedAnalyses = window.localStorage.getItem("kestrel_saved_analyses")
      const parsedAnalyses = rawSavedAnalyses ? JSON.parse(rawSavedAnalyses) : []

      const normalizedAnalyses = Array.isArray(parsedAnalyses)
        ? parsedAnalyses.map(normalizeSavedAnalysis)
        : []

      setSavedAnalyses(normalizedAnalyses)
    } catch (error) {
      console.error("Failed to load roadmap data:", error)
    }
  }, [])

  const latestAnalysis = savedAnalyses[0] ?? null
  const roadmapData = useMemo(() => buildRoadmapData(latestAnalysis), [latestAnalysis])

  const allItems = useMemo(
    () => [...roadmapData.now, ...roadmapData.soon, ...roadmapData.later],
    [roadmapData]
  )

  useEffect(() => {
    if (!latestAnalysis) {
      setCompletedTasks({})
      setExpandedItems([])
      return
    }

    try {
      const rawProgress = window.localStorage.getItem(getProgressStorageKey(latestAnalysis.id))
      const parsedProgress = rawProgress ? JSON.parse(rawProgress) : {}

      setCompletedTasks(parsedProgress && typeof parsedProgress === "object" ? parsedProgress : {})
      setExpandedItems(allItems.slice(0, 2).map((item) => item.id))
    } catch {
      setCompletedTasks({})
      setExpandedItems(allItems.slice(0, 2).map((item) => item.id))
    }
  }, [latestAnalysis, allItems])

  useEffect(() => {
    if (!latestAnalysis) return
    window.localStorage.setItem(
      getProgressStorageKey(latestAnalysis.id),
      JSON.stringify(completedTasks)
    )
  }, [completedTasks, latestAnalysis])

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )
  }

  const toggleSubtask = (itemId: number, subtaskIndex: number) => {
    setCompletedTasks((prev) => {
      const current = prev[itemId] || []
      if (current.includes(subtaskIndex)) {
        return { ...prev, [itemId]: current.filter((i) => i !== subtaskIndex) }
      }
      return { ...prev, [itemId]: [...current, subtaskIndex] }
    })
  }

  const resetRoadmapProgress = () => {
    setCompletedTasks({})
    if (latestAnalysis) {
      window.localStorage.removeItem(getProgressStorageKey(latestAnalysis.id))
    }
  }

  const totalProgress = allItems.length
    ? Math.round(
        allItems.reduce((acc, item) => {
          const completed = (completedTasks[item.id] || []).length
          const total = item.subtasks.length || 1
          return acc + (completed / total) * 100
        }, 0) / allItems.length
      )
    : 0

  const completedMilestones = allItems.filter(
    (item) => (completedTasks[item.id] || []).length === item.subtasks.length
  ).length

  const estimatedWeeks = Math.max(
    1,
    Math.ceil((roadmapData.soon.length * 2 + roadmapData.later.length * 3 + roadmapData.now.length) / 3)
  )

  if (!latestAnalysis || allItems.length === 0) {
    return (
      <div className="pb-20 lg:pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166]">
              Your Career Roadmap
            </h1>
            <p className="mt-1 text-[#6B6F8E]">
              This will populate from your real saved analyses when you are ready.
            </p>
          </div>
        </div>

        <EmptyRoadmapState />
      </div>
    )
  }

  return (
    <div className="pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166]">
            Your Career Roadmap
          </h1>
          <p className="mt-1 text-[#6B6F8E]">
            Strategic plan to reach {latestAnalysis.role}
            {latestAnalysis.company !== "Unknown" ? ` at ${latestAnalysis.company}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#3C4166]/15 text-[#3C4166]">
            <Calendar className="h-4 w-4 mr-2" />
            Add to Calendar
          </Button>
          <Button
            variant="outline"
            className="border-[#3C4166]/15 text-[#3C4166]"
            onClick={resetRoadmapProgress}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>

      <Card className="mb-8 bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7] border-0 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <CardContent className="py-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-28 h-28 -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="white"
                    strokeOpacity="0.2"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(totalProgress / 100) * 301} 301`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{totalProgress}%</span>
                  <span className="text-xs opacity-80">Complete</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Mission Progress</h3>
                <p className="text-white/80 text-sm">
                  {completedMilestones} of {allItems.length} milestones complete
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold">{roadmapData.now.length}</p>
                <p className="text-sm opacity-80">Do Now</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold">{roadmapData.soon.length}</p>
                <p className="text-sm opacity-80">Do Soon</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold">{roadmapData.later.length}</p>
                <p className="text-sm opacity-80">Do Later</p>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <p className="text-3xl font-bold">{estimatedWeeks} weeks</p>
              <p className="text-sm opacity-80">Estimated completion</p>
              <p className="text-xs opacity-60 mt-1">Based on your latest saved analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <RoadmapSection
          title="Do Now"
          subtitle="Quick wins you can complete right away"
          icon={<Zap className="h-5 w-5 text-white" />}
          iconBg="bg-[#4FA7A7]"
          items={roadmapData.now}
          expandedItems={expandedItems}
          completedTasks={completedTasks}
          onToggleExpanded={toggleExpanded}
          onToggleSubtask={toggleSubtask}
        />

        <RoadmapSection
          title="Do Soon"
          subtitle="High-priority items for the next stretch"
          icon={<Clock className="h-5 w-5 text-white" />}
          iconBg="bg-[#E87BF1]"
          items={roadmapData.soon}
          expandedItems={expandedItems}
          completedTasks={completedTasks}
          onToggleExpanded={toggleExpanded}
          onToggleSubtask={toggleSubtask}
        />

        <RoadmapSection
          title="Do Later"
          subtitle="Longer-term steps to deepen your fit"
          icon={<Target className="h-5 w-5 text-white" />}
          iconBg="bg-[#7ED7F7]"
          items={roadmapData.later}
          expandedItems={expandedItems}
          completedTasks={completedTasks}
          onToggleExpanded={toggleExpanded}
          onToggleSubtask={toggleSubtask}
        />
      </div>
    </div>
  )
}

function RoadmapSection({
  title,
  subtitle,
  icon,
  iconBg,
  items,
  expandedItems,
  completedTasks,
  onToggleExpanded,
  onToggleSubtask,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  iconBg: string
  items: RoadmapItem[]
  expandedItems: number[]
  completedTasks: { [key: number]: number[] }
  onToggleExpanded: (id: number) => void
  onToggleSubtask: (itemId: number, subtaskIndex: number) => void
}) {
  if (items.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", iconBg)}>
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#3C4166]">{title}</h2>
          <p className="text-sm text-[#6B6F8E]">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4 ml-5 pl-8 border-l-2 border-[#3C4166]/10">
        {items.map((item) => {
          const Icon = categoryIcons[item.category] || Target
          const isExpanded = expandedItems.includes(item.id)
          const itemCompleted = completedTasks[item.id] || []
          const progress = Math.round((itemCompleted.length / item.subtasks.length) * 100)
          const isComplete = progress === 100

          return (
            <Card
              key={item.id}
              className={cn(
                "bg-white/70 backdrop-blur-sm border-[#3C4166]/10 transition-all ml-4",
                isComplete && "opacity-60"
              )}
            >
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <div className="relative -ml-12 mt-1">
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border-2 border-white shadow-sm",
                        isComplete
                          ? "bg-[#4FA7A7]"
                          : progress > 0
                            ? "bg-[#E87BF1]"
                            : "bg-[#3C4166]/20"
                      )}
                    />
                  </div>

                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br flex-shrink-0",
                      categoryColors[item.category]
                    )}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#3C4166]/10 text-[#6B6F8E]">
                            {item.category}
                          </span>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              item.priority === "critical"
                                ? "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                                : item.priority === "high"
                                  ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                                  : "bg-[#7ED7F7]/20 text-[#4FA7A7]"
                            )}
                          >
                            {item.priority} priority
                          </span>
                          {isComplete && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#C8F5DF] text-[#4FA7A7]">
                              Complete
                            </span>
                          )}
                        </div>
                        <h3
                          className={cn(
                            "text-lg font-semibold text-[#3C4166] mb-1",
                            isComplete && "line-through"
                          )}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#6B6F8E] mb-3">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-1.5 text-[#6B6F8E]">
                            <Clock className="h-4 w-4" />
                            {item.timeEstimate}
                          </span>
                          <span className="flex items-center gap-1.5 text-[#6B6F8E]">
                            <Target className="h-4 w-4" />
                            {item.skillTarget}
                          </span>
                          <span className="flex items-center gap-1.5 text-[#4FA7A7]">
                            <CheckCircle2 className="h-4 w-4" />
                            {itemCompleted.length}/{item.subtasks.length} tasks
                          </span>
                        </div>

                        <div className="mt-4">
                          <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all bg-gradient-to-r",
                                isComplete
                                  ? "from-[#4FA7A7] to-[#7ED7F7]"
                                  : "from-[#E87BF1] to-[#C9B6E4]"
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleExpanded(item.id)}
                        className="p-2 text-[#6B6F8E] hover:text-[#3C4166] transition-colors flex-shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-[#3C4166]/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-[#3C4166] mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                              Tasks
                            </h4>
                            <div className="space-y-2">
                              {item.subtasks.map((subtask, i) => {
                                const isDone = itemCompleted.includes(i)
                                return (
                                  <button
                                    key={i}
                                    onClick={() => onToggleSubtask(item.id, i)}
                                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#F6F1E7]/50 transition-colors text-left"
                                  >
                                    {isDone ? (
                                      <CheckCircle2 className="h-4 w-4 text-[#4FA7A7] flex-shrink-0" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-[#6B6F8E] flex-shrink-0" />
                                    )}
                                    <span
                                      className={cn(
                                        "text-sm",
                                        isDone ? "text-[#6B6F8E] line-through" : "text-[#3C4166]"
                                      )}
                                    >
                                      {subtask.title}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-[#3C4166] mb-3 flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-[#E87BF1]" />
                              Resources
                            </h4>
                            <div className="space-y-2">
                              {item.resources.map((resource, i) =>
                                resource.internal ? (
                                  <Link
                                    key={i}
                                    href={resource.url}
                                    className="flex items-center gap-2 p-2 rounded-lg bg-[#F6F1E7]/50 text-sm text-[#4FA7A7] hover:bg-[#4FA7A7]/10 transition-colors"
                                  >
                                    <FileText className="h-4 w-4" />
                                    {resource.title}
                                  </Link>
                                ) : (
                                  <a
                                    key={i}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-2 rounded-lg bg-[#F6F1E7]/50 text-sm text-[#4FA7A7] hover:bg-[#4FA7A7]/10 transition-colors"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    {resource.title}
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                          {!isComplete && (
                            <Button className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-full">
                              <Play className="h-4 w-4 mr-2" />
                              {progress > 0 ? "Continue" : "Start"}
                            </Button>
                          )}
                          {isComplete && (
                            <Button variant="outline" className="border-[#4FA7A7] text-[#4FA7A7]">
                              <Star className="h-4 w-4 mr-2" />
                              Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}