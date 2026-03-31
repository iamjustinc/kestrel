"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Map,
  Target,
  TrendingUp,
  Sparkles,
  Clock,
  CheckCircle2,
  FileText,
  Zap,
  BarChart3,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { getDemoUser, type DemoUser } from "@/lib/demo-auth"

type SavedProfile = {
  resumeText: string
  updatedAt: string
}

type GapItem = {
  skill?: string
  importance?: string
  currentLevel?: number
  suggestion?: string
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
    now?: Array<{ action?: string; effort?: string; impact?: string }>
    soon?: Array<{ action?: string; effort?: string; impact?: string }>
    later?: Array<{ action?: string; effort?: string; impact?: string }>
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

type DashboardAction = {
  title: string
  tag: string
  type: "course" | "project" | "cert"
  time: string
}

const readinessTrend = [
  { month: "Jan", value: 62 },
  { month: "Feb", value: 68 },
  { month: "Mar", value: 72 },
  { month: "Apr", value: 78 },
]

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

function formatSavedTime(value: string) {
  try {
    const saved = new Date(value).getTime()
    const now = Date.now()
    const diffMs = Math.max(0, now - saved)
    const day = 1000 * 60 * 60 * 24
    const days = Math.floor(diffMs / day)

    if (days <= 0) return "Today"
    if (days === 1) return "1 day ago"
    if (days < 7) return `${days} days ago`

    const weeks = Math.floor(days / 7)
    if (weeks === 1) return "1 week ago"
    if (weeks < 5) return `${weeks} weeks ago`

    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  } catch {
    return "Recently"
  }
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

function getImpactRank(value: string) {
  const normalized = value.toLowerCase()
  if (normalized === "critical") return 4
  if (normalized === "high") return 3
  if (normalized === "medium") return 2
  return 1
}

function getAllGapItems(item: SavedAnalysisItem) {
  const skillGaps = item.analysis?.skillGaps

  const all = [
    ...(skillGaps?.technical ?? []),
    ...(skillGaps?.productBusiness ?? []),
    ...(skillGaps?.communication ?? []),
    ...(skillGaps?.toolsPlatforms ?? []),
  ]

  return all
    .map((gap) => ({
      skill: asString(gap?.skill, ""),
      impact: asString(gap?.importance, "Medium"),
      progress: clampPercent(gap?.currentLevel, 0),
    }))
    .filter((gap) => gap.skill)
}

function getTopSkillGaps(item: SavedAnalysisItem) {
  return getAllGapItems(item)
    .sort((a, b) => {
      const impactDiff = getImpactRank(b.impact) - getImpactRank(a.impact)
      if (impactDiff !== 0) return impactDiff
      return a.progress - b.progress
    })
    .slice(0, 3)
}

function inferActionType(title: string): "course" | "project" | "cert" {
  const value = title.toLowerCase()

  if (
    value.includes("cert") ||
    value.includes("certificate") ||
    value.includes("certification") ||
    value.includes("aws")
  ) {
    return "cert"
  }

  if (
    value.includes("project") ||
    value.includes("portfolio") ||
    value.includes("build") ||
    value.includes("ship")
  ) {
    return "project"
  }

  return "course"
}

function getActionTag(impact: string) {
  const normalized = impact.toLowerCase()
  if (normalized === "critical" || normalized === "high") return "High Impact"
  if (normalized === "medium") return "Quick Win"
  return "Next Step"
}

function getUpcomingActions(item: SavedAnalysisItem): DashboardAction[] {
  const nextSteps = item.analysis?.nextSteps

  const steps = [
    ...(nextSteps?.now ?? []),
    ...(nextSteps?.soon ?? []),
    ...(nextSteps?.later ?? []),
  ]

  return steps
    .map((step) => {
      const title = asString(step?.action, "")
      if (!title) return null

      return {
        title,
        tag: getActionTag(asString(step?.impact, "Medium")),
        type: inferActionType(title),
        time: asString(step?.effort, "Planned"),
      }
    })
    .filter(Boolean)
    .slice(0, 3) as DashboardAction[]
}

function getTargetRoles(savedAnalyses: SavedAnalysisItem[]) {
  const grouped = new Map<
    string,
    { role: string; totalReadiness: number; analyses: number }
  >()

  savedAnalyses.forEach((item) => {
    const key = item.role
    const existing = grouped.get(key)

    if (existing) {
      existing.totalReadiness += item.readinessScore
      existing.analyses += 1
    } else {
      grouped.set(key, {
        role: item.role,
        totalReadiness: item.readinessScore,
        analyses: 1,
      })
    }
  })

  return Array.from(grouped.values())
    .map((item) => ({
      role: item.role,
      avgReadiness: Math.round(item.totalReadiness / item.analyses),
      analyses: item.analyses,
    }))
    .sort((a, b) => b.analyses - a.analyses || b.avgReadiness - a.avgReadiness)
    .slice(0, 3)
}

function EmptyCardMessage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3C4166]/5">
        <AlertCircle className="h-5 w-5 text-[#6B6F8E]" />
      </div>
      <p className="text-sm font-medium text-[#3C4166]">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-[#6B6F8E]">{description}</p>
    </div>
  )
}

export default function DashboardPage() {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysisItem[]>([])
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null)

  useEffect(() => {
    setDemoUser(getDemoUser())

    try {
      const rawSavedAnalyses = window.localStorage.getItem("kestrel_saved_analyses")
      const parsedAnalyses = rawSavedAnalyses ? JSON.parse(rawSavedAnalyses) : []

      const normalizedAnalyses = Array.isArray(parsedAnalyses)
        ? parsedAnalyses.map(normalizeSavedAnalysis)
        : []

      setSavedAnalyses(normalizedAnalyses)

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
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }, [])

  const firstName = useMemo(() => {
    const savedFirstName = demoUser?.firstName?.trim()
    return savedFirstName && savedFirstName.length > 0 ? savedFirstName : "there"
  }, [demoUser])

  const hasSavedAnalyses = savedAnalyses.length > 0
  const recentAnalyses = savedAnalyses.slice(0, 3)
  const latestAnalysis = savedAnalyses[0] ?? null
  const targetRoles = getTargetRoles(savedAnalyses)
  const topSkillGaps = latestAnalysis ? getTopSkillGaps(latestAnalysis) : []
  const nextActions = latestAnalysis ? getUpcomingActions(latestAnalysis) : []
  const resumeScore = latestAnalysis ? latestAnalysis.atsScore : null

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166]">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-[#6B6F8E]">
          Track your progress and take the next step in your career journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <Card className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7] border-0 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Overall Readiness</p>
                <h2 className="text-5xl font-bold tracking-tight">78%</h2>
                <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +12% from last month
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Target className="h-7 w-7" />
              </div>
            </div>

            <div className="flex items-end gap-2 h-16 mt-4">
              {readinessTrend.map((point) => (
                <div key={point.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-white/30 transition-all"
                    style={{ height: `${(point.value / 100) * 60}px` }}
                  />
                  <span className="text-[10px] text-white/60">{point.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#3C4166]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/analysis">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#E87BF1]/10 to-[#C9B6E4]/10 border border-[#E87BF1]/20 hover:border-[#E87BF1]/40 transition-all cursor-pointer group">
                  <Sparkles className="h-5 w-5 text-[#E87BF1] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-[#3C4166]">New Analysis</span>
                </div>
              </Link>
              <Link href="/dashboard/analysis">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#7ED7F7]/10 to-[#4FA7A7]/10 border border-[#7ED7F7]/20 hover:border-[#7ED7F7]/40 transition-all cursor-pointer group">
                  <BarChart3 className="h-5 w-5 text-[#4FA7A7] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-[#3C4166]">Compare Roles</span>
                </div>
              </Link>
              <Link href="/dashboard/resume-lab">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#F7C7D4]/20 to-[#FF8FA3]/10 border border-[#F7C7D4]/30 hover:border-[#F7C7D4]/50 transition-all cursor-pointer group">
                  <FileText className="h-5 w-5 text-[#FF8FA3] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-[#3C4166]">Update Resume</span>
                </div>
              </Link>
              <Link href="/dashboard/roadmap">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#C8F5DF]/30 to-[#4FA7A7]/10 border border-[#C8F5DF]/40 hover:border-[#C8F5DF]/60 transition-all cursor-pointer group">
                  <Map className="h-5 w-5 text-[#4FA7A7] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-[#3C4166]">Continue Roadmap</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base text-[#3C4166]">Recent Analyses</CardTitle>
              <CardDescription className="text-[#6B6F8E] text-sm">Your latest role assessments</CardDescription>
            </div>
            <Link href="/dashboard/saved">
              <Button variant="ghost" size="sm" className="text-[#6B6F8E] hover:text-[#3C4166] text-xs">
                View all
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!hasSavedAnalyses ? (
              <EmptyCardMessage
                title="It seems empty in here."
                description="Add your first role analysis to start seeing recent analyses here."
              />
            ) : (
              <div className="space-y-3">
                {recentAnalyses.map((analysis) => (
                  <Link
                    key={analysis.id}
                    href="/dashboard/analysis/results"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F6F1E7]/50 hover:bg-[#F6F1E7] border border-transparent hover:border-[#3C4166]/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7] flex items-center justify-center shadow-sm">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-[#3C4166] group-hover:text-[#4FA7A7] transition-colors">
                          {analysis.role}
                        </h3>
                        <p className="text-xs text-[#6B6F8E]">
                          {analysis.company} &middot; {formatSavedTime(analysis.savedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-lg font-semibold text-[#4FA7A7]">{analysis.readinessScore}%</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#6B6F8E] group-hover:text-[#4FA7A7] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#3C4166]">Target Roles</CardTitle>
          </CardHeader>
          <CardContent>
            {targetRoles.length === 0 ? (
              <EmptyCardMessage
                title="No target roles yet."
                description="Save a role analysis and your target roles will show up here."
              />
            ) : (
              <div className="space-y-3">
                {targetRoles.map((target) => (
                  <div key={target.role} className="p-3 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#3C4166]">{target.role}</span>
                      <span className="text-xs text-[#6B6F8E]">{target.analyses} analyses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]"
                          style={{ width: `${target.avgReadiness}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-[#4FA7A7]">{target.avgReadiness}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#3C4166]">Roadmap Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyCardMessage
              title="No roadmap progress yet."
              description="This will populate once your roadmap milestones are being tracked."
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base text-[#3C4166]">Priority Skill Gaps</CardTitle>
              <CardDescription className="text-[#6B6F8E] text-sm">Focus areas for improvement</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {topSkillGaps.length === 0 ? (
              <EmptyCardMessage
                title="No skill gaps yet."
                description="Analyze and save a role first, then your real skill gaps will appear here."
              />
            ) : (
              <div className="space-y-4">
                {topSkillGaps.map((gap) => (
                  <div key={gap.skill}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[#3C4166]">{gap.skill}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          gap.impact.toLowerCase() === "critical" || gap.impact.toLowerCase() === "high"
                            ? "bg-[#FF8FA3]/15 text-[#FF8FA3]"
                            : "bg-[#7ED7F7]/15 text-[#4FA7A7]"
                        }`}
                      >
                        {gap.impact} Impact
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          gap.progress < 50
                            ? "bg-gradient-to-r from-[#FF8FA3] to-[#F7C7D4]"
                            : gap.progress < 70
                              ? "bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4]"
                              : "bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]"
                        }`}
                        style={{ width: `${gap.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-2 bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base text-[#3C4166]">Upcoming Suggested Actions</CardTitle>
              <CardDescription className="text-[#6B6F8E] text-sm">Your prioritized next steps</CardDescription>
            </div>
            <Link href="/dashboard/roadmap">
              <Button variant="ghost" size="sm" className="text-[#6B6F8E] hover:text-[#3C4166] text-xs">
                Full roadmap
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {nextActions.length === 0 ? (
              <EmptyCardMessage
                title="No suggested actions yet."
                description="Save an analysis to see your real next steps here."
              />
            ) : (
              <div className="space-y-3">
                {nextActions.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5 hover:border-[#3C4166]/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          action.type === "course"
                            ? "bg-[#E87BF1]/15"
                            : action.type === "project"
                              ? "bg-[#C8F5DF]"
                              : "bg-[#7ED7F7]/15"
                        }`}
                      >
                        {action.type === "course" ? (
                          <TrendingUp className="h-5 w-5 text-[#E87BF1]" />
                        ) : action.type === "project" ? (
                          <Zap className="h-5 w-5 text-[#4FA7A7]" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-[#7ED7F7]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-[#3C4166]">{action.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              action.tag === "High Impact"
                                ? "bg-[#FF8FA3]/15 text-[#FF8FA3]"
                                : action.tag === "Quick Win"
                                  ? "bg-[#C8F5DF] text-[#4FA7A7]"
                                  : "bg-[#C9B6E4]/20 text-[#C9B6E4]"
                            }`}
                          >
                            {action.tag}
                          </span>
                          <span className="text-xs text-[#6B6F8E] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {action.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#4FA7A7] hover:text-[#4FA7A7]/80 hover:bg-[#4FA7A7]/10">
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#F7C7D4]/30 to-[#C9B6E4]/20 border-[#F7C7D4]/30">
          <CardContent className="pt-6">
            {resumeScore === null ? (
              <div className="flex h-full min-h-[210px] flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-white/60 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#E87BF1]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3C4166]">Resume Score</h3>
                    <p className="text-xs text-[#6B6F8E]">Based on your target roles</p>
                  </div>
                </div>
                <p className="text-sm text-[#6B6F8E] mb-4">
                  It seems empty in here. Add a role and resume to start.
                </p>
                <Link href="/dashboard/resume-lab">
                  <Button variant="outline" size="sm" className="w-full border-[#E87BF1]/30 text-[#E87BF1] hover:bg-[#E87BF1]/10 hover:border-[#E87BF1]/50">
                    Open Resume Lab
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-white/60 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#E87BF1]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3C4166]">Resume Score</h3>
                    <p className="text-xs text-[#6B6F8E]">Based on your target roles</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-[#3C4166]">{resumeScore}</span>
                  <span className="text-sm text-[#6B6F8E]">/ 100</span>
                </div>
                <div className="h-2 rounded-full bg-white/60 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4]"
                    style={{ width: `${resumeScore}%` }}
                  />
                </div>
                <Link href="/dashboard/resume-lab">
                  <Button variant="outline" size="sm" className="w-full border-[#E87BF1]/30 text-[#E87BF1] hover:bg-[#E87BF1]/10 hover:border-[#E87BF1]/50">
                    Improve Resume
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7] border-0 text-white">
          <CardContent className="pt-6">
            {!hasSavedAnalyses ? (
              <div className="flex h-full min-h-[210px] flex-col justify-center">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Get started</h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                      It seems empty in here. Add a role and resume to start.
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/analysis">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    Add first role
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Pro Tip</h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                      Analyze 3+ similar roles to get more accurate skill gap detection.
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/analysis">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    Add another role
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
