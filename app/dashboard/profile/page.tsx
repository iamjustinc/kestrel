"use client"

import { useEffect, useMemo, useState } from "react"
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
  History
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getDemoUser, getDisplayName, getInitials, type DemoUser } from "@/lib/demo-auth"

// Mock profile data
const profileData = {
  name: "Alex Johnson",
  headline: "Product-minded engineer transitioning to PM",
  email: "alex@example.com",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexj",
  avatar: "AJ",
  profileStrength: 85,

  targetRoles: [
    { role: "Product Manager", priority: "primary" },
    { role: "Solutions Engineer", priority: "secondary" },
    { role: "Technical PM", priority: "secondary" },
  ],

  preferredIndustries: ["Fintech", "Developer Tools", "B2B SaaS", "Productivity"],

  skills: [
    { name: "Product Strategy", level: "Expert", verified: true },
    { name: "Cross-functional Leadership", level: "Advanced", verified: true },
    { name: "User Research", level: "Intermediate", verified: false },
    { name: "SQL & Data Analysis", level: "Beginner", verified: false },
    { name: "Agile/Scrum", level: "Advanced", verified: true },
    { name: "Stakeholder Management", level: "Advanced", verified: false },
  ],

  resumeVersions: [
    { name: "PM_Resume_v3.pdf", uploadedAt: "2 hours ago", current: true, size: "245 KB" },
    { name: "PM_Resume_v2.pdf", uploadedAt: "1 week ago", current: false, size: "238 KB" },
    { name: "SE_Resume_v1.pdf", uploadedAt: "2 weeks ago", current: false, size: "242 KB" },
  ],

  goals: {
    targetDate: "Q2 2026",
    status: "On Track",
    currentReadiness: 78,
    targetReadiness: 90,
  },

  milestones: [
    { title: "Complete SQL Course", target: "April 15", status: "in-progress", progress: 35 },
    { title: "Update Resume with Metrics", target: "April 1", status: "complete", progress: 100 },
    { title: "Get Amplitude Certification", target: "April 20", status: "upcoming", progress: 0 },
  ],

  recentProgress: [
    { action: "Completed resume optimization", date: "Today", type: "achievement" },
    { action: "Started SQL fundamentals course", date: "Yesterday", type: "learning" },
    { action: "Analyzed PM role at Stripe", date: "2 days ago", type: "analysis" },
    { action: "Added 3 new skills to profile", date: "3 days ago", type: "profile" },
  ]
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)

  useEffect(() => {
    setDemoUser(getDemoUser())
  }, [])

  const liveProfileData = useMemo(() => {
    return {
      ...profileData,
      name: getDisplayName(demoUser),
      email: demoUser?.email ?? profileData.email,
      avatar: getInitials(demoUser),
    }
  }, [demoUser])

  return (
    <div className="pb-20 lg:pb-0">
      {/* Header */}
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
          className={isEditing
            ? "bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white"
            : "border-[#3C4166]/15 text-[#3C4166]"
          }
        >
          {isEditing ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Changes
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
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10 overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-[#4FA7A7] via-[#7ED7F7] to-[#C9B6E4]" />
            <CardContent className="relative pt-0 -mt-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#C9B6E4] to-[#F7C7D4] ring-4 ring-white shadow-lg flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{liveProfileData.avatar}</span>
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#4FA7A7] text-white flex items-center justify-center shadow-md hover:bg-[#4FA7A7]/90 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Basic info */}
                <div className="flex-1 pb-2">
                  <h2 className="text-xl font-semibold text-[#3C4166]">{liveProfileData.name}</h2>
                  <p className="text-[#6B6F8E]">{liveProfileData.headline}</p>
                </div>

                {/* Profile strength */}
                <div className="sm:text-right pb-2">
                  <p className="text-sm text-[#6B6F8E] mb-1">Profile Strength</p>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <div className="w-24 h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]"
                        style={{ width: `${liveProfileData.profileStrength}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#4FA7A7]">{liveProfileData.profileStrength}%</span>
                  </div>
                </div>
              </div>

              {/* Contact info */}
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

          {/* Target Roles */}
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
                {isEditing && (
                  <Button variant="ghost" size="sm" className="text-[#4FA7A7]">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Preferred Industries */}
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
                {isEditing && (
                  <button className="px-3 py-1.5 rounded-full border-2 border-dashed border-[#3C4166]/20 text-[#6B6F8E] text-sm hover:border-[#4FA7A7] hover:text-[#4FA7A7] transition-colors">
                    <Plus className="h-3.5 w-3.5 inline mr-1" />
                    Add
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
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
                {isEditing && (
                  <Button variant="ghost" size="sm" className="text-[#4FA7A7]">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
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
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        skill.level === "Expert"
                          ? "bg-[#4FA7A7]/15 text-[#4FA7A7]"
                          : skill.level === "Advanced"
                            ? "bg-[#E87BF1]/15 text-[#E87BF1]"
                            : skill.level === "Intermediate"
                              ? "bg-[#7ED7F7]/15 text-[#4FA7A7]"
                              : "bg-[#FF8FA3]/15 text-[#FF8FA3]"
                      )}>
                        {skill.level}
                      </span>
                      {isEditing && (
                        <button className="opacity-0 group-hover:opacity-100 text-[#6B6F8E] hover:text-[#FF8FA3] transition-all">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resume Versions */}
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
                <Button variant="outline" size="sm" className="border-[#4FA7A7] text-[#4FA7A7]">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {liveProfileData.resumeVersions.map((resume) => (
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
                    <FileText className={cn(
                      "h-5 w-5",
                      resume.current ? "text-[#4FA7A7]" : "text-[#6B6F8E]"
                    )} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#3C4166]">{resume.name}</p>
                        {resume.current && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#4FA7A7] text-white">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B6F8E]">{resume.uploadedAt} • {resume.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B6F8E]">
                      <Download className="h-4 w-4" />
                    </Button>
                    {!resume.current && (
                      <Button variant="ghost" size="sm" className="text-[#4FA7A7] text-xs">
                        Set as Current
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Goals & Progress */}
        <div className="space-y-6">
          {/* Goals & Timeline */}
          <Card className="bg-gradient-to-br from-[#4FA7A7]/10 to-[#7ED7F7]/10 border-[#4FA7A7]/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#4FA7A7] flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Career Goal</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Target: {liveProfileData.goals.targetDate}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                    <span className="text-3xl font-bold text-[#3C4166]">{liveProfileData.goals.currentReadiness}%</span>
                    <span className="text-xs text-[#6B6F8E]">Ready</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#6B6F8E]">Target Readiness</span>
                <span className="font-medium text-[#4FA7A7]">{liveProfileData.goals.targetReadiness}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden mb-4">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]"
                  style={{ width: `${(liveProfileData.goals.currentReadiness / liveProfileData.goals.targetReadiness) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  liveProfileData.goals.status === "On Track"
                    ? "bg-[#C8F5DF] text-[#4FA7A7]"
                    : "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                )}>
                  {liveProfileData.goals.status}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Readiness Milestones */}
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
              {liveProfileData.milestones.map((milestone) => (
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
                      <span className={cn(
                        "text-sm font-medium",
                        milestone.status === "complete" ? "text-[#4FA7A7] line-through" : "text-[#3C4166]"
                      )}>
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
              ))}
            </CardContent>
          </Card>

          {/* Recent Progress */}
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
              <div className="space-y-3">
                {liveProfileData.recentProgress.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full mt-2",
                      item.type === "achievement" ? "bg-[#4FA7A7]" :
                      item.type === "learning" ? "bg-[#E87BF1]" :
                      item.type === "analysis" ? "bg-[#7ED7F7]" :
                      "bg-[#C9B6E4]"
                    )} />
                    <div>
                      <p className="text-sm text-[#3C4166]">{item.action}</p>
                      <p className="text-xs text-[#6B6F8E]">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4] border-0 text-white">
            <CardContent className="pt-6 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-90" />
              <h3 className="font-semibold mb-2">Ready to level up?</h3>
              <p className="text-sm text-white/80 mb-4">
                Continue your roadmap to reach your career goal.
              </p>
              <Button className="bg-white text-[#E87BF1] hover:bg-white/90 rounded-full w-full">
                View Roadmap
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}