"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Upload,
  FileText,
  Link as LinkIcon,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  File
} from "lucide-react"

const analysisSteps = [
  "Parsing job description",
  "Extracting required skills",
  "Processing your resume",
  "Mapping skills to requirements",
  "Calculating readiness score",
  "Generating recommendations",
  "Finalizing analysis",
]

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt"]

type SavedProfile = {
  resumeText: string
  updatedAt: string
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatSavedDate(value: string) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  } catch {
    return "recently"
  }
}

export default function AnalysisPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [jobDescription, setJobDescription] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [urlStatus, setUrlStatus] = useState<"idle" | "saved" | "invalid">("idle")

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [showResumeText, setShowResumeText] = useState(false)
  const [useSavedProfile, setUseSavedProfile] = useState(false)
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null)
  const [resumeError, setResumeError] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const [targetRole, setTargetRole] = useState("")
  const [timeline, setTimeline] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [notes, setNotes] = useState("")

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [analysisError, setAnalysisError] = useState("")

  useEffect(() => {
    const raw = window.localStorage.getItem("kestrel_saved_profile")
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as SavedProfile
      if (parsed?.resumeText) {
        setSavedProfile(parsed)
      }
    } catch {}
  }, [])

  const jobWordCount = jobDescription.trim().split(/\s+/).filter(Boolean).length
  const resumeWordCount = resumeText.trim().split(/\s+/).filter(Boolean).length

  const hasResumeSource =
    Boolean(resumeFile) ||
    resumeText.trim().length > 0 ||
    (useSavedProfile && Boolean(savedProfile?.resumeText))

  const canAnalyze = jobDescription.trim().length > 0 && hasResumeSource

  const validateAndSetFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || ""

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setResumeError("Please upload a PDF, DOCX, or TXT file.")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setResumeError("Please upload a file smaller than 5MB.")
      return
    }

    setResumeError("")
    setResumeFile(file)
    setResumeText("")
    setShowResumeText(false)
    setUseSavedProfile(false)
    setAnalysisError("")
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) validateAndSetFile(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file) validateAndSetFile(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFetchUrl = () => {
    if (!jobUrl.trim()) {
      setUrlStatus("invalid")
      return
    }

    try {
      new URL(jobUrl)
      setUrlStatus("saved")
    } catch {
      setUrlStatus("invalid")
    }
  }

  const handleResumeTextChange = (value: string) => {
    setResumeError("")
    setResumeText(value)

    if (value.trim().length > 0) {
      setResumeFile(null)
      setUseSavedProfile(false)
      setShowResumeText(true)
    }
  }

  const handleToggleSavedProfile = () => {
    if (!savedProfile) return

    const nextValue = !useSavedProfile
    setUseSavedProfile(nextValue)
    setAnalysisError("")

    if (nextValue) {
      setResumeFile(null)
      setResumeText("")
      setShowResumeText(false)
      setResumeError("")
    }
  }

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze || isAnalyzing) return
  
    setAnalysisError("")
    setIsAnalyzing(true)
    setCurrentStep(0)
  
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("jobUrl", jobUrl)
    formData.append("targetRole", targetRole)
    formData.append("timeline", timeline)
    formData.append("notes", notes)
  
    if (resumeFile) {
      formData.append("resumeFile", resumeFile)
    }
  
    if (resumeText.trim()) {
      formData.append("resumeText", resumeText.trim())
    }
  
    if (useSavedProfile && savedProfile?.resumeText) {
      formData.append("savedProfileResumeText", savedProfile.resumeText)
    }
  
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })
  
      const raw = await response.text()
  
      let data: any = null
  
      try {
        data = raw ? JSON.parse(raw) : null
      } catch {
        throw new Error(raw || "Server returned a non-JSON response.")
      }
  
      if (!response.ok) {
        throw new Error(data?.error || "Failed to analyze this application.")
      }
  
      if (data?.normalizedResumeText) {
        const nextSavedProfile: SavedProfile = {
          resumeText: data.normalizedResumeText,
          updatedAt: new Date().toISOString(),
        }
  
        window.localStorage.setItem(
          "kestrel_saved_profile",
          JSON.stringify(nextSavedProfile)
        )
        setSavedProfile(nextSavedProfile)
      }
  
      window.localStorage.setItem("kestrel_last_analysis", JSON.stringify(data))
  
      setCurrentStep(analysisSteps.length - 1)
  
      await new Promise((resolve) => setTimeout(resolve, 350))
  
      router.push("/dashboard/analysis/results")
    } catch (error) {
      setIsAnalyzing(false)
      setCurrentStep(0)
      setAnalysisError(
        error instanceof Error ? error.message : "Failed to run analysis."
      )
    }
  }, [
    canAnalyze,
    isAnalyzing,
    jobDescription,
    jobUrl,
    targetRole,
    timeline,
    notes,
    resumeFile,
    resumeText,
    useSavedProfile,
    savedProfile,
    router,
  ])

  useEffect(() => {
    if (!isAnalyzing) return
  
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= analysisSteps.length - 2) return prev
        return prev + 1
      })
    }, 450)
  
    return () => {
      clearInterval(interval)
    }
  }, [isAnalyzing])

  const isWrappingUp = currentStep >= analysisSteps.length - 1

const displayedStepLabel = isWrappingUp
  ? "Wrapping up"
  : analysisSteps[currentStep]

const displayedProgress = isWrappingUp
  ? 99
  : Math.min(
      99,
      Math.round(((currentStep + 1) / analysisSteps.length) * 100)
    )

const displayedSteps = isWrappingUp
  ? [...analysisSteps.slice(0, analysisSteps.length - 1), "Wrapping up"]
  : analysisSteps.slice(0, currentStep + 1)

  if (isAnalyzing) {
    return (
      <div className="mx-auto max-w-3xl pb-20 lg:pb-0">
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
  
          <div className="relative mb-10">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4FA7A7] to-[#E87BF1] blur-3xl opacity-25 animate-pulse"
              style={{ width: 180, height: 180, marginLeft: -90, marginTop: -90 }}
            />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#4FA7A7] via-[#7ED7F7] to-[#E87BF1] shadow-2xl shadow-[#4FA7A7]/30">
              <Sparkles className="h-10 w-10 text-white animate-pulse" />
            </div>
          </div>
  
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-[#3C4166]">
              Analyzing with Kestrel
            </h2>
  
            <p className="flex items-center justify-center gap-2 text-[#6B6F8E]">
              {displayedStepLabel}
              <span className="inline-flex">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
              </span>
            </p>
  
            <p className="mt-2 text-sm text-[#6B6F8E]/80">
              This may take up to 2 minutes
            </p>
          </div>
  
          <div className="mb-7 w-full max-w-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-[#6B6F8E]">Progress</span>
              <span className="text-xs font-medium text-[#4FA7A7]">
                {displayedProgress}%
              </span>
            </div>
  
            <div className="h-2 overflow-hidden rounded-full bg-[#3C4166]/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#E87BF1] transition-all duration-500"
                style={{ width: `${displayedProgress}%` }}
              />
            </div>
          </div>
  
          <div className="w-full max-w-md rounded-xl border border-[#3C4166]/10 bg-white/70 p-4 backdrop-blur-sm">
            <div className="space-y-2 font-mono text-xs text-[#6B6F8E]">
              {displayedSteps.map((step, index) => (
                <div key={`${step}-${index}`} className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-3 w-3 ${
                      index === displayedSteps.length - 1
                        ? "text-[#E87BF1]"
                        : "text-[#4FA7A7]"
                    }`}
                  />
                  <span
                    className={
                      index === displayedSteps.length - 1
                        ? "text-[#3C4166]"
                        : ""
                    }
                  >
                    {step}...
                  </span>
                </div>
              ))}
            </div>
          </div>
  
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl pb-24 lg:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#3C4166] sm:text-3xl">
          New Analysis
        </h1>
        <p className="mt-1 text-[#6B6F8E]">
          Paste a job description and add your resume to prepare for AI-powered career insights
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[#3C4166]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7]">
                <FileText className="h-4 w-4 text-white" />
              </div>
              Job Description
            </CardTitle>
            <CardDescription className="text-[#6B6F8E]">
              Paste the full job description for the role you&apos;re targeting
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={`Paste the job description here...

Example:
About the Role
We're looking for a Product Manager to lead our growth team. You'll work cross-functionally with engineering, design, and marketing to define and execute our product roadmap.

Requirements
• 3+ years of product management experience
• Strong analytical skills
• Experience with experimentation
• Excellent stakeholder management`}
              className="h-72 w-full resize-none rounded-xl border border-[#3C4166]/10 bg-white/80 p-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 transition-all focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20"
            />

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-[#3C4166]/10" />
              <span className="text-xs text-[#6B6F8E]">or paste a URL</span>
              <div className="h-px flex-1 bg-[#3C4166]/10" />
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6F8E]" />
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => {
                    setJobUrl(e.target.value)
                    setUrlStatus("idle")
                  }}
                  placeholder="linkedin.com/jobs/... or greenhouse.io/..."
                  className="h-11 w-full rounded-xl border border-[#3C4166]/10 bg-white/80 pl-10 pr-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 transition-all focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleFetchUrl}
                className="h-11 border-[#3C4166]/15 px-5 text-[#3C4166] hover:bg-[#3C4166]/5"
              >
                Fetch
              </Button>
            </div>

            {urlStatus === "saved" && (
              <div className="flex items-center gap-2 rounded-lg border border-[#4FA7A7]/20 bg-[#C8F5DF]/30 p-3">
                <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                <span className="text-sm text-[#3C4166]">
                  URL saved for later extraction
                </span>
              </div>
            )}

            {urlStatus === "invalid" && (
              <div className="flex items-center gap-2 rounded-lg border border-[#FF8FA3]/20 bg-[#FF8FA3]/10 p-3">
                <AlertCircle className="h-4 w-4 text-[#FF8FA3]" />
                <span className="text-sm text-[#3C4166]">
                  Please enter a valid URL
                </span>
              </div>
            )}

            {jobDescription.trim().length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-[#4FA7A7]/20 bg-[#C8F5DF]/30 p-3">
                <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                <span className="text-sm text-[#3C4166]">Job description ready</span>
                <span className="ml-auto text-xs text-[#6B6F8E]">
                  {jobWordCount} words
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[#3C4166]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#E87BF1] to-[#C9B6E4]">
                <Upload className="h-4 w-4 text-white" />
              </div>
              Your Resume
            </CardTitle>
            <CardDescription className="text-[#6B6F8E]">
              Upload your resume, paste the text, or use your saved profile
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className={useSavedProfile ? "opacity-50 pointer-events-none" : ""}>
              {!resumeFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                    isDragging
                      ? "border-[#E87BF1] bg-[#E87BF1]/5"
                      : "border-[#3C4166]/15 hover:border-[#E87BF1]/40 hover:bg-[#E87BF1]/5"
                  }`}
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F7C7D4]/50 to-[#E87BF1]/15">
                    <Upload className="h-7 w-7 text-[#E87BF1]" />
                  </div>

                  <p className="font-medium text-[#3C4166]">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-sm text-[#6B6F8E]">
                    PDF, DOCX, or TXT up to 5MB
                  </p>

                  <div className="mt-4 inline-flex rounded-full bg-[#3C4166]/5 px-3 py-1 text-xs text-[#6B6F8E]">
                    Supports ATS-optimized formats
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#4FA7A7]/20 bg-[#C8F5DF]/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                      <File className="h-5 w-5 text-[#4FA7A7]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#3C4166]">{resumeFile.name}</p>
                      <p className="text-sm text-[#6B6F8E]">
                        {formatFileSize(resumeFile.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="rounded-lg p-1 text-[#6B6F8E] transition-colors hover:bg-white hover:text-[#3C4166]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="my-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#3C4166]/10" />
                <span className="text-xs text-[#6B6F8E]">or</span>
                <div className="h-px flex-1 bg-[#3C4166]/10" />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowResumeText((prev) => !prev)
                  setResumeFile(null)
                  setUseSavedProfile(false)
                  setResumeError("")
                }}
                className="h-11 w-full border-[#3C4166]/15 bg-transparent text-[#3C4166] hover:bg-[#3C4166]/5"
              >
                <FileText className="mr-2 h-4 w-4" />
                {showResumeText ? "Hide pasted resume text" : "Paste resume text instead"}
              </Button>

              {showResumeText && (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={resumeText}
                    onChange={(e) => handleResumeTextChange(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="h-44 w-full resize-none rounded-xl border border-[#3C4166]/10 bg-white/80 p-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 transition-all focus:border-[#E87BF1] focus:outline-none focus:ring-2 focus:ring-[#E87BF1]/20"
                  />

                  {resumeText.trim().length > 0 && (
                    <div className="flex items-center gap-2 rounded-lg border border-[#4FA7A7]/20 bg-[#C8F5DF]/30 p-3">
                      <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                      <span className="text-sm text-[#3C4166]">Resume text ready</span>
                      <span className="ml-auto text-xs text-[#6B6F8E]">
                        {resumeWordCount} words
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <label
              className={`block rounded-xl border p-4 transition-all ${
                savedProfile
                  ? "cursor-pointer border-[#3C4166]/10 bg-[#F6F1E7]/60 hover:border-[#4FA7A7]/20"
                  : "cursor-not-allowed border-[#3C4166]/10 bg-[#F6F1E7]/40 opacity-70"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={useSavedProfile}
                  onChange={handleToggleSavedProfile}
                  disabled={!savedProfile}
                  className="mt-1 h-4 w-4 rounded border-[#3C4166]/20 accent-[#4FA7A7]"
                />

                <div className="flex-1">
                  <p className="font-medium text-[#3C4166]">
                    Use my saved Kestrel profile instead
                  </p>

                  {savedProfile ? (
                    <p className="mt-1 text-sm text-[#6B6F8E]">
                      Last updated {formatSavedDate(savedProfile.updatedAt)}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-[#6B6F8E]">
                      No saved profile yet. Run one analysis first to save it.
                    </p>
                  )}
                </div>
              </div>
            </label>

            {resumeError && (
              <div className="flex items-center gap-2 rounded-lg border border-[#FF8FA3]/20 bg-[#FF8FA3]/10 p-3">
                <AlertCircle className="h-4 w-4 text-[#FF8FA3]" />
                <span className="text-sm text-[#3C4166]">{resumeError}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-[#3C4166]/10 bg-white/70 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="flex w-full items-center justify-between px-6 py-5 text-left"
        >
          <div>
            <h3 className="text-lg font-semibold text-[#3C4166]">Additional Options</h3>
            <p className="text-sm text-[#6B6F8E]">Customize your analysis settings</p>
          </div>

          {showAdvanced ? (
            <ChevronUp className="h-5 w-5 text-[#6B6F8E]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#6B6F8E]" />
          )}
        </button>

        {showAdvanced && (
          <CardContent className="grid grid-cols-1 gap-4 pt-0 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#3C4166]">
                Target role
              </label>
              <div className="relative">
                <Target className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6F8E]" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Product Manager, Solutions Engineer..."
                  className="h-11 w-full rounded-xl border border-[#3C4166]/10 bg-white/80 pl-10 pr-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 transition-all focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3C4166]">
                Timeline
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6F8E]" />
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-[#3C4166]/10 bg-white/80 pl-10 pr-4 text-sm text-[#3C4166] transition-all focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20"
                >
                  <option value="">Select a timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="30-days">Within 30 days</option>
                  <option value="60-days">Within 60 days</option>
                  <option value="90-days">Within 90 days</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#3C4166]">
                Notes for Kestrel
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything specific you want the analysis to focus on?"
                className="h-28 w-full resize-none rounded-xl border border-[#3C4166]/10 bg-white/80 p-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 transition-all focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {analysisError && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#FF8FA3]/20 bg-[#FF8FA3]/10 p-4">
          <AlertCircle className="h-4 w-4 text-[#FF8FA3]" />
          <span className="text-sm text-[#3C4166]">{analysisError}</span>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#3C4166]/10 bg-white/70 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B6F8E]">
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${
                jobDescription.trim().length > 0 ? "bg-[#4FA7A7]" : "bg-[#3C4166]/15"
              }`}
            />
            <span>Job description</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${
                hasResumeSource ? "bg-[#4FA7A7]" : "bg-[#3C4166]/15"
              }`}
            />
            <span>Resume</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className={`min-w-[220px] rounded-full px-6 ${
              canAnalyze
                ? "bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7] text-white hover:opacity-95"
                : "bg-[#DDE8EE] text-white hover:bg-[#DDE8EE]"
            }`}
          >
            Analyze with Kestrel
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}