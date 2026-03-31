"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mail,
  MapPin,
  Briefcase,
  Link as LinkIcon,
  Edit2,
  Plus,
  X,
  CheckCircle2,
  Target,
  Clock,
  TrendingUp,
  FileText,
  Upload,
  Download,
  Calendar,
  Sparkles,
  Award,
  ArrowRight,
  History,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getDemoUser, getDisplayName, getInitials, type DemoUser } from "@/lib/demo-auth"

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
  strengths?: Array<{
    skill?: string
    level?: string
    evidence?: string
  }>
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

type SavedProfile = {
  resumeText: string
  updatedAt: string
}

type ResumeVersion = {
  name: string
  uploadedAt: string
  current: boolean
  size: string
}

type MilestoneItem = {
  title: string
  target: string
  status: "complete" | "in-progress" | "upcoming"
  progress: number
}

type RecentProgressItem = {
  action: string
  date: string
  type: "achievement" | "learning" | "analysis" | "profile"
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
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback
}

function formatRelativeDate(value: string) {
  try {
    const saved = new Date(value).getTime()
    const now = Date.now()
    const diffMs = Math.max(0, now - saved)
    const day = 1000 * 60 * 60 * 24
    const days = Math.floor(diffMs / day)

    if (days <= 0) return "Today"
    if (days === 1) return "Yesterday"
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

function formatTargetDate(value: string) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  } catch {
    return "Soon"
  }
}

function getRoadmapStorageKey(analysisId: string) {
  return `kestrel_roadmap_progress_${analysisId}`
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

function inferRolePriority(index: number) {
  return index === 0 ? "primary" : "secondary"
}

function inferIndustries(savedAnalyses: SavedAnalysisItem[]) {
  const roleText = savedAnalyses.map((item) => item.role.toLowerCase()).join(" ")
  const industries: string[] = []

  if (roleText.includes("salesforce")) industries.push("CRM")
  if (roleText.includes("solution") || roleText.includes("engineer")) industries.push("B2B SaaS")
  if (roleText.includes("product")) industries.push("Productivity")
  if (roleText.includes("data") || roleText.includes("analytics")) industries.push("Analytics")
  if (roleText.includes("developer") || roleText.includes("technical")) industries.push("Developer Tools")

  return industries.length > 0 ? industries.slice(0, 4) : ["Career Exploration"]
}

function inferSkillLevel(currentLevel?: number) {
  const value = clampPercent(currentLevel, 0)
  if (value >= 85) return "Expert"
  if (value >= 70) return "Advanced"
  if (value >= 50) return "Intermediate"
  return "Beginner"
}

function getTopSkills(latestAnalysis: SavedAnalysisItem | null) {
  if (!latestAnalysis?.analysis) return []

  const strengths = latestAnalysis.analysis.strengths ?? []
  const mappedStrengths = strengths
    .filter((item) => asString(item?.skill, ""))
    .map((item) => ({
      name: asString(item?.skill, "Skill"),
      level: asString(item?.level, "Advanced"),
      verified: true,
    }))

  if (mappedStrengths.length > 0) return mappedStrengths.slice(0, 6)

  const gaps = [
    ...(latestAnalysis.analysis.skillGaps?.technical ?? []),
    ...(latestAnalysis.analysis.skillGaps?.productBusiness ?? []),
    ...(latestAnalysis.analysis.skillGaps?.communication ?? []),
    ...(latestAnalysis.analysis.skillGaps?.toolsPlatforms ?? []),
  ]

  return gaps
    .filter((item) => asString(item?.skill, ""))
    .slice(0, 6)
    .map((item) => ({
      name: asString(item?.skill, "Skill"),
      level: inferSkillLevel(item?.currentLevel),
      verified: false,
    }))
}

function buildResumeVersions(savedProfile: SavedProfile | null): ResumeVersion[] {
  if (!savedProfile?.resumeText) return []

  const sizeKb = Math.max(1, Math.round(new Blob([savedProfile.resumeText]).size / 1024))

  return [
    {
      name: "Current_Resume.txt",
      uploadedAt: formatRelativeDate(savedProfile.updatedAt),
      current: true,
      size: `${sizeKb} KB`,
    },
  ]
}

function getProfileStrength(
  demoUser: DemoUser | null,
  savedProfile: SavedProfile | null,
  savedAnalyses: SavedAnalysisItem[],
  latestAnalysis: SavedAnalysisItem | null
) {
  let score = 20

  if (demoUser?.firstName) score += 15
  if (demoUser?.lastName) score += 10
  if (demoUser?.email) score += 10
  if (savedProfile?.resumeText) score += 20
  if (savedAnalyses.length > 0) score += 15
  if (latestAnalysis?.analysis?.nextSteps) score += 10

  return Math.min(score, 100)
}

function getRoadmapSummary(savedAnalysis: SavedAnalysisItem | null) {
  if (!savedAnalysis?.analysis) {
    return {
      totalProgress: 0,
      completedMilestones: 0,
      totalMilestones: 0,
      milestoneItems: [] as MilestoneItem[],
      recentProgress: [] as RecentProgressItem[],
    }
  }

  const nextSteps = savedAnalysis.analysis.nextSteps
  const groupedSteps = [
    ...(nextSteps?.now ?? []).map((item) => ({ ...item, bucket: "now" as const })),
    ...(nextSteps?.soon ?? []).map((item) => ({ ...item, bucket: "soon" as const })),
    ...(nextSteps?.later ?? []).map((item) => ({ ...item, bucket: "later" as const })),
  ].filter((item) => asString(item?.action, ""))

  const totalMilestones = groupedSteps.length

  let completedTasks: Record<string, number[]> = {}
  try {
    const raw = window.localStorage.getItem(getRoadmapStorageKey(savedAnalysis.id))
    completedTasks = raw ? JSON.parse(raw) : {}
  } catch {
    completedTasks = {}
  }

  const milestoneItems: MilestoneItem[] = groupedSteps.slice(0, 3).map((item, index) => {
    const itemId = index + 1
    const completedCount = Array.isArray(completedTasks[itemId]) ? completedTasks[itemId].length : 0
    const progress = Math.round((completedCount / 3) * 100)

    return {
      title: asString(item.action, "Next step"),
      target:
        item.bucket === "now"
          ? "This week"
          : item.bucket === "soon"
            ? "Next 2 weeks"
            : "Later",
      status:
        progress >= 100
          ? "complete"
          : progress > 0
            ? "in-progress"
            : "upcoming",
      progress,
    }
  })

  const completedMilestones = milestoneItems.filter((item) => item.progress >= 100).length

  const totalProgress =
    totalMilestones > 0
      ? Math.round(
          groupedSteps.reduce((acc, _, index) => {
            const itemId = index + 1
            const completedCount = Array.isArray(completedTasks[itemId]) ? completedTasks[itemId].length : 0
            return acc + (completedCount / 3) * 100
          }, 0) / totalMilestones
        )
      : 0

  const recentProgress: RecentProgressItem[] = []

  if (savedProfile) {
    recentProgress.push({
      action: "Updated saved resume profile",
      date: formatRelativeDate(savedProfile.updatedAt),
      type: "profile",
    })
  }

  if (savedAnalysis) {
    recentProgress.push({
      action: `Analyzed ${savedAnalysis.role}${savedAnalysis.company !== "Unknown" ? ` at ${savedAnalysis.company}` : ""}`,
      date: formatRelativeDate(savedAnalysis.savedAt),
      type: "analysis",
    })
  }

  if (milestoneItems.some((item) => item.status === "complete")) {
    recentProgress.push({
      action: "Completed at least one roadmap milestone",
      date: "Recently",
      type: "achievement",
    })
  }

  if (milestoneItems.some((item) => item.status === "in-progress")) {
    recentProgress.push({
      action: "Made progress on your roadmap",
      date: "Recently",
      type: "learning",
    })
  }

  return {
    totalProgress,
    completedMilestones,
    totalMilestones,
    milestoneItems,
    recentProgress: recentProgress.slice(0, 4),
  }
}

function EmptyProfileBlock({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3C4166]/5">
        <AlertCircle className="h-5 w-5 text-[#6B6F8E]" />
      </div>
      <p className="text-sm font-medium text-[#3C4166]">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-[#6B6F8E]">{description}</p>
    </div>
  )
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
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
      console.error("Failed to load profile data:", error)
    }
  }, [])

  const latestAnalysis = savedAnalyses[0] ?? null
  const roadmapSummary = getRoadmapSummary(latestAnalysis)

  const liveProfileData = useMemo(() => {
    const displayName = getDisplayName(demoUser)
    const initials = getInitials(demoUser)
    const resumeVersions = buildResumeVersions(savedProfile)

    return {
      name: displayName,
      headline:
        latestAnalysis?.role
          ? `Actively exploring ${latestAnalysis.role}${latestAnalysis.company !== "Unknown" ? ` roles like ${latestAnalysis.company}` : ""}`
          : "Build your career profile by saving analyses and a resume",
      email: demoUser?.email ?? "No email saved yet",
      location: "Not set",
      linkedin: "Add your link in a later pass",
      avatar: initials,
      profileStrength: getProfileStrength(demoUser, savedProfile, savedAnalyses, latestAnalysis),

      targetRoles: savedAnalyses.slice(0, 3).map((item, index) => ({
        role: item.role,
        priority: inferRolePriority(index),
      })),

      preferredIndustries: inferIndustries(savedAnalyses),

      skills: getTopSkills(latestAnalysis),

      resumeVersions,

      goals: {
        targetDate:
          latestAnalysis
            ? formatTargetDate(latestAnalysis.savedAt)
            : "Not set",
        status:
          latestAnalysis?.readinessScore && latestAnalysis.readinessScore >= 70
            ? "On Track"
            : latestAnalysis
              ? "In Progress"
              : "Not Started",
        currentReadiness: latestAnalysis?.readinessScore ?? 0,
        targetReadiness: 90,
      },

      milestones: roadmapSummary.milestoneItems,
      recentProgress: roadmapSummary.recentProgress,
    }
  }, [demoUser, latestAnalysis, roadmapSummary, savedAnalyses, savedProfile])

  return (
    <div className="pb-20 lg:pb-0">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166]">
            Career Control Center
          </h1>
          <p className="mt-1 text-[#6B6F8E]">
            Your personalized career intelligence hub
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "default" : "outline"}
          className={
            isEditing
              ? "bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white"
              : "border-[#3C4166]/15 text-[#3C4166]"
          }
        >
          {isEditing ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Done
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10 overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-[#4FA7A7] via-[#7ED7F7] to-[#C9B6E4]" />
            <CardContent className="relative pt-0 -mt-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#C9B6E4] to-[#F7C7D4] ring-4 ring-white shadow-lg flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{liveProfileData.avatar}</span>
                  </div>
                </div>

                <div className="flex-1 pb-2">
                  <h2 className="text-xl font-semibold text-[#3C4166]">{liveProfileData.name}</h2>
                  <p className="text-[#6B6F8E]">{liveProfileData.headline}</p>
                </div>

                <div className="sm:text-right pb-2">
                  <p className="text-sm text-[#6B6F8E] mb-1">Profile Strength</p>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <div className="w-24 h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]"
                        style={{ width: `${liveProfileData.profileStrength}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#4FA7A7]">
                      {liveProfileData.profileStrength}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F1E7]/50">
                  <Mail className="h-4 w-4 text-[#6B6F8E]" />
                  <span className="text-sm text-[#3C4166]">{liveProfileData.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F1E7]/50">
                  <MapPin className="h-4 w-4 text-[#6B6F8E]" />
                  <span className="text-sm text-[#3C4166]">{liveProfileData.location}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F1E7]/50">
                  <LinkIcon className="h-4 w-4 text-[#6B6F8E]" />
                  <span className="text-sm text-[#4FA7A7]">{liveProfileData.linkedin}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4FA7A7]/20 to-[#7ED7F7]/20 flex items-center justify-center">
                    <Target className="h-5 w-5 text-[#4FA7A7]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">Target Roles</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">Roles you&apos;re actively pursuing</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {liveProfileData.targetRoles.length === 0 ? (
                <EmptyProfileBlock
                  title="No target roles yet."
                  description="Save an analysis and your target roles will appear here."
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {liveProfileData.targetRoles.map((role) => (
                    <span
                      key={role.role}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2",
                        role.priority === "primary"
                          ? "bg-[#4FA7A7]/10 text-[#4FA7A7] border-[#4FA7A7]/20"
                          : "bg-[#C9B6E4]/10 text-[#6B6F8E] border-[#C9B6E4]/20"
                      )}
                    >
                      {role.priority === "primary" && <Sparkles className="h-3.5 w-3.5" />}
                      {role.role}
                      {isEditing && (
                        <button className="ml-1 hover:text-[#FF8FA3]">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#E87BF1]/20 to-[#C9B6E4]/20 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-[#E87BF1]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Preferred Industries</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Sectors you&apos;re interested in</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {liveProfileData.preferredIndustries.map((industry) => (
                  <span
                    key={industry}
                    className="px-3 py-1.5 rounded-full bg-[#F6F1E7] text-[#3C4166] text-sm border border-[#3C4166]/10"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#7ED7F7]/30 to-[#4FA7A7]/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-[#4FA7A7]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">Top Skills</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">Your professional skills</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {liveProfileData.skills.length === 0 ? (
                <EmptyProfileBlock
                  title="No skills yet."
                  description="Save an analysis to surface your real strengths and gaps here."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {liveProfileData.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5 group"
                    >
                      <div className="flex items-center gap-2">
                        {skill.verified && (
                          <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                        )}
                        <span className="text-sm font-medium text-[#3C4166]">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            skill.level === "Expert"
                              ? "bg-[#4FA7A7]/15 text-[#4FA7A7]"
                              : skill.level === "Advanced"
                                ? "bg-[#E87BF1]/15 text-[#E87BF1]"
                                : skill.level === "Intermediate"
                                  ? "bg-[#7ED7F7]/15 text-[#4FA7A7]"
                                  : "bg-[#FF8FA3]/15 text-[#FF8FA3]"
                          )}
                        >
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F7C7D4]/50 to-[#E87BF1]/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#E87BF1]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">Resume Versions</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">Your uploaded resumes</CardDescription>
                  </div>
                </div>
                <Link href="/dashboard/resume-lab">
                  <Button variant="outline" size="sm" className="border-[#4FA7A7] text-[#4FA7A7]">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload New
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {liveProfileData.resumeVersions.length === 0 ? (
                <EmptyProfileBlock
                  title="No resume saved yet."
                  description="Open Resume Lab or run an analysis to create your first saved resume profile."
                />
              ) : (
                liveProfileData.resumeVersions.map((resume) => (
                  <div
                    key={resume.name}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border",
                      resume.current
                        ? "bg-[#4FA7A7]/5 border-[#4FA7A7]/20"
                        : "bg-[#F6F1E7]/50 border-[#3C4166]/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <FileText
                        className={cn(
                          "h-5 w-5",
                          resume.current ? "text-[#4FA7A7]" : "text-[#6B6F8E]"
                        )}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#3C4166]">{resume.name}</p>
                          {resume.current && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#4FA7A7] text-white">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B6F8E]">
                          {resume.uploadedAt} • {resume.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href="/dashboard/resume-lab">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B6F8E]">
                          <Download className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#4FA7A7]/10 to-[#7ED7F7]/10 border-[#4FA7A7]/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#4FA7A7] flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Career Goal</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">
                    Target: {liveProfileData.goals.targetDate}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {liveProfileData.goals.currentReadiness === 0 ? (
                <EmptyProfileBlock
                  title="No goal signal yet."
                  description="Save an analysis to start tracking your real career readiness."
                />
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div className="relative inline-block">
                      <svg className="w-32 h-32 -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#3C4166"
                          strokeOpacity="0.1"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#profileGradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(liveProfileData.goals.currentReadiness / 100) * 352} 352`}
                        />
                        <defs>
                          <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4FA7A7" />
                            <stop offset="100%" stopColor="#7ED7F7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-[#3C4166]">
                          {liveProfileData.goals.currentReadiness}%
                        </span>
                        <span className="text-xs text-[#6B6F8E]">Ready</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#6B6F8E]">Target Readiness</span>
                    <span className="font-medium text-[#4FA7A7]">
                      {liveProfileData.goals.targetReadiness}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]"
                      style={{
                        width: `${Math.min(
                          (liveProfileData.goals.currentReadiness / liveProfileData.goals.targetReadiness) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        liveProfileData.goals.status === "On Track"
                          ? "bg-[#C8F5DF] text-[#4FA7A7]"
                          : liveProfileData.goals.status === "In Progress"
                            ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                            : "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                      )}
                    >
                      {liveProfileData.goals.status}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#E87BF1]/20 to-[#C9B6E4]/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[#E87BF1]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Milestones</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Upcoming goals</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {liveProfileData.milestones.length === 0 ? (
                <EmptyProfileBlock
                  title="No milestones yet."
                  description="Your roadmap milestones will show up here once you have a saved roadmap."
                />
              ) : (
                liveProfileData.milestones.map((milestone) => (
                  <div
                    key={milestone.title}
                    className={cn(
                      "p-3 rounded-xl border",
                      milestone.status === "complete"
                        ? "bg-[#C8F5DF]/20 border-[#4FA7A7]/20"
                        : milestone.status === "in-progress"
                          ? "bg-[#E87BF1]/5 border-[#E87BF1]/20"
                          : "bg-[#F6F1E7]/50 border-[#3C4166]/5"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {milestone.status === "complete" ? (
                          <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                        ) : milestone.status === "in-progress" ? (
                          <Clock className="h-4 w-4 text-[#E87BF1]" />
                        ) : (
                          <Calendar className="h-4 w-4 text-[#6B6F8E]" />
                        )}
                        <span
                          className={cn(
                            "text-sm font-medium",
                            milestone.status === "complete"
                              ? "text-[#4FA7A7] line-through"
                              : "text-[#3C4166]"
                          )}
                        >
                          {milestone.title}
                        </span>
                      </div>
                      <span className="text-xs text-[#6B6F8E]">{milestone.target}</span>
                    </div>
                    {milestone.status !== "complete" && milestone.status !== "upcoming" && (
                      <div className="h-1.5 rounded-full bg-[#3C4166]/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4]"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#C9B6E4]/30 to-[#F7C7D4]/30 flex items-center justify-center">
                  <History className="h-5 w-5 text-[#C9B6E4]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Recent Activity</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Your progress</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {liveProfileData.recentProgress.length === 0 ? (
                <EmptyProfileBlock
                  title="No recent activity yet."
                  description="As you save analyses and work through your roadmap, activity will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {liveProfileData.recentProgress.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full mt-2",
                          item.type === "achievement"
                            ? "bg-[#4FA7A7]"
                            : item.type === "learning"
                              ? "bg-[#E87BF1]"
                              : item.type === "analysis"
                                ? "bg-[#7ED7F7]"
                                : "bg-[#C9B6E4]"
                        )}
                      />
                      <div>
                        <p className="text-sm text-[#3C4166]">{item.action}</p>
                        <p className="text-xs text-[#6B6F8E]">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4] border-0 text-white">
            <CardContent className="pt-6 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-90" />
              <h3 className="font-semibold mb-2">Ready to level up?</h3>
              <p className="text-sm text-white/80 mb-4">
                Continue your roadmap to reach your career goal.
              </p>
              <Link href="/dashboard/roadmap">
                <Button className="bg-white text-[#E87BF1] hover:bg-white/90 rounded-full w-full">
                  View Roadmap
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}