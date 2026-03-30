"use client"

import { useState, useEffect, useCallback } from "react"
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
  ChevronDown
} from "lucide-react"
import Link from "next/link"

const analysisSteps = [
  { text: "Parsing job description...", delay: 0 },
  { text: "Extracting required skills...", delay: 800 },
  { text: "Analyzing experience requirements...", delay: 1600 },
  { text: "Processing your resume...", delay: 2400 },
  { text: "Mapping skills to requirements...", delay: 3200 },
  { text: "Calculating readiness score...", delay: 4000 },
  { text: "Generating skill gap analysis...", delay: 4800 },
  { text: "Building personalized roadmap...", delay: 5600 },
  { text: "Finalizing recommendations...", delay: 6400 },
]

const confidenceIndicators = [
  { skill: "Technical Skills", confidence: 0 },
  { skill: "Experience Match", confidence: 0 },
  { skill: "Leadership", confidence: 0 },
  { skill: "Culture Fit", confidence: 0 },
]

export default function AnalysisPage() {
  const [jobDescription, setJobDescription] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [confidences, setConfidences] = useState(confidenceIndicators)
  const [targetRole, setTargetRole] = useState("")
  const [timeline, setTimeline] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [notes, setNotes] = useState("")

  const handleAnalyze = useCallback(() => {
    setIsAnalyzing(true)
    setCurrentStep(0)
    setConfidences(confidenceIndicators.map(c => ({ ...c, confidence: 0 })))
  }, [])

  useEffect(() => {
    if (!isAnalyzing) return

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= analysisSteps.length - 1) {
          clearInterval(stepInterval)
          // Navigate after a brief delay
          setTimeout(() => {
            window.location.href = "/dashboard/analysis/results"
          }, 1000)
          return prev
        }
        return prev + 1
      })
    }, 800)

    // Animate confidence indicators
    const confidenceInterval = setInterval(() => {
      setConfidences(prev => prev.map(c => ({
        ...c,
        confidence: Math.min(c.confidence + Math.random() * 15, 95)
      })))
    }, 400)

    return () => {
      clearInterval(stepInterval)
      clearInterval(confidenceInterval)
    }
  }, [isAnalyzing])

  if (isAnalyzing) {
    return (
      <div className="max-w-3xl mx-auto pb-20 lg:pb-0">
        {/* AI Scanning Animation */}
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          {/* Glowing orb */}
          <div className="relative mb-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4FA7A7] to-[#E87BF1] blur-3xl opacity-30 animate-pulse" 
              style={{ width: 200, height: 200, marginLeft: -100, marginTop: -100 }} 
            />
            <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-[#4FA7A7] via-[#7ED7F7] to-[#E87BF1] flex items-center justify-center shadow-2xl shadow-[#4FA7A7]/30">
              <Sparkles className="h-12 w-12 text-white animate-pulse" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 h-3 w-3 rounded-full bg-[#F7C7D4]" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 h-2 w-2 rounded-full bg-[#C9B6E4]" />
            </div>
          </div>

          {/* Status text with typing effect */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-[#3C4166] mb-3">
              Analyzing with Kestrel
            </h2>
            <div className="h-6 flex items-center justify-center">
              <p className="text-[#6B6F8E] flex items-center gap-2">
                {analysisSteps[currentStep]?.text}
                <span className="inline-flex">
                  <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                </span>
              </p>
            </div>
          </div>

          {/* Progress steps */}
          <div className="w-full max-w-md mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6B6F8E]">Progress</span>
              <span className="text-xs text-[#4FA7A7] font-medium">
                {Math.round(((currentStep + 1) / analysisSteps.length) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#E87BF1] transition-all duration-500"
                style={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Confidence indicators */}
          <div className="w-full max-w-md grid grid-cols-2 gap-3">
            {confidences.map((item) => (
              <div 
                key={item.skill}
                className="p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-[#3C4166]/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#6B6F8E]">{item.skill}</span>
                  <span className={`text-xs font-medium ${
                    item.confidence > 70 ? "text-[#4FA7A7]" : 
                    item.confidence > 40 ? "text-[#E87BF1]" : "text-[#6B6F8E]"
                  }`}>
                    {Math.round(item.confidence)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#3C4166]/10 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.confidence > 70 ? "bg-[#4FA7A7]" : 
                      item.confidence > 40 ? "bg-[#E87BF1]" : "bg-[#C9B6E4]"
                    }`}
                    style={{ width: `${item.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live analysis log */}
          <div className="w-full max-w-md mt-8 p-4 rounded-xl bg-[#3C4166]/5 border border-[#3C4166]/10">
            <div className="font-mono text-xs space-y-1.5 text-[#6B6F8E] max-h-32 overflow-hidden">
              {analysisSteps.slice(0, currentStep + 1).map((step, i) => (
                <div key={i} className="flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className={`h-3 w-3 ${i === currentStep ? "text-[#E87BF1]" : "text-[#4FA7A7]"}`} />
                  <span className={i === currentStep ? "text-[#3C4166]" : ""}>{step.text}</span>
                </div>
              ))}
              {currentStep < analysisSteps.length - 1 && (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border-2 border-[#E87BF1] border-t-transparent animate-spin" />
                  <span className="text-[#E87BF1]">Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166]">
          New Analysis
        </h1>
        <p className="mt-1 text-[#6B6F8E]">
          Paste a job description and upload your resume to get AI-powered career insights
        </p>
      </div>

      {/* Dual-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left pane - Job Description */}
        <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardHeader>
            <CardTitle className="text-lg text-[#3C4166] flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7] flex items-center justify-center">
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
• Strong analytical skills (SQL, data analysis)
• Experience with A/B testing and experimentation
• Excellent communication and stakeholder management
• Technical background preferred`}
              className="w-full h-72 rounded-xl border border-[#3C4166]/10 bg-white/80 p-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20 resize-none transition-all"
            />
            
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#3C4166]/10" />
              <span className="text-xs text-[#6B6F8E]">or paste a URL</span>
              <div className="flex-1 h-px bg-[#3C4166]/10" />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F8E]" />
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="linkedin.com/jobs/... or greenhouse.io/..."
                  className="w-full h-11 rounded-xl border border-[#3C4166]/10 bg-white/80 pl-10 pr-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20 transition-all"
                />
              </div>
              <Button variant="outline" className="h-11 border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5 px-5">
                Fetch
              </Button>
            </div>

            {jobDescription && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#C8F5DF]/30 border border-[#4FA7A7]/20">
                <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                <span className="text-sm text-[#3C4166]">Job description ready</span>
                <span className="text-xs text-[#6B6F8E] ml-auto">{jobDescription.split(" ").length} words</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right pane - Resume Upload */}
        <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardHeader>
            <CardTitle className="text-lg text-[#3C4166] flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#E87BF1] to-[#C9B6E4] flex items-center justify-center">
                <Upload className="h-4 w-4 text-white" />
              </div>
              Your Resume
            </CardTitle>
            <CardDescription className="text-[#6B6F8E]">
              Upload your resume or use your saved profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!resumeUploaded ? (
              <div 
                onClick={() => setResumeUploaded(true)}
                className="border-2 border-dashed border-[#3C4166]/15 rounded-xl p-8 text-center hover:border-[#E87BF1]/50 hover:bg-[#E87BF1]/5 transition-all cursor-pointer group"
              >
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-[#E87BF1]/15 to-[#C9B6E4]/15 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Upload className="h-7 w-7 text-[#E87BF1]" />
                </div>
                <p className="text-sm font-medium text-[#3C4166] mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-[#6B6F8E] mb-4">
                  PDF, DOCX, or TXT (max 5MB)
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3C4166]/5 text-xs text-[#6B6F8E]">
                  <FileText className="h-3 w-3" />
                  Supports ATS-optimized formats
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#C8F5DF]/30 border border-[#4FA7A7]/20">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-[#4FA7A7]/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-[#4FA7A7]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#3C4166]">Alex_Johnson_Resume.pdf</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#6B6F8E]">245 KB</span>
                      <span className="text-xs text-[#4FA7A7]">Ready to analyze</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setResumeUploaded(false)}
                  className="p-2 text-[#6B6F8E] hover:text-[#3C4166] hover:bg-[#3C4166]/5 rounded-lg transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#3C4166]/10" />
              <span className="text-xs text-[#6B6F8E]">or</span>
              <div className="flex-1 h-px bg-[#3C4166]/10" />
            </div>

            {/* Paste resume option */}
            <Button 
              variant="outline" 
              className="w-full h-11 border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5"
              onClick={() => setResumeUploaded(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Paste resume text instead
            </Button>

            {/* Use saved profile option */}
            <div className="mt-4 p-4 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="use-profile" 
                  className="rounded border-[#3C4166]/20 text-[#4FA7A7] focus:ring-[#4FA7A7]/20"
                  onChange={(e) => {
                    if (e.target.checked) setResumeUploaded(true)
                  }}
                />
                <label htmlFor="use-profile" className="text-sm text-[#3C4166] cursor-pointer">
                  Use my saved Kestrel profile instead
                </label>
              </div>
              <p className="text-xs text-[#6B6F8E] mt-2 ml-6">
                Your profile was last updated 3 days ago
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional controls - spans both columns */}
        <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardHeader className="pb-3">
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left"
            >
              <div>
                <CardTitle className="text-lg text-[#3C4166]">Additional Options</CardTitle>
                <CardDescription className="text-[#6B6F8E]">
                  Customize your analysis settings
                </CardDescription>
              </div>
              <ChevronDown className={`h-5 w-5 text-[#6B6F8E] transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            </button>
          </CardHeader>
          {showAdvanced && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#3C4166]">Target Role Title</label>
                  <div className="relative">
                    <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F8E]" />
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g., Product Manager"
                      className="w-full h-11 rounded-xl border border-[#3C4166]/10 bg-white/80 pl-10 pr-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#3C4166]">Desired Timeline</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F8E]" />
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#3C4166]/10 bg-white/80 pl-10 pr-4 text-sm text-[#3C4166] focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20 appearance-none cursor-pointer"
                    >
                      <option value="">Select timeline</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="3-months">Within 3 months</option>
                      <option value="6-months">Within 6 months</option>
                      <option value="1-year">Within 1 year</option>
                      <option value="exploring">Just exploring</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F8E] pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-medium text-[#3C4166]">Additional Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any extra context..."
                    className="w-full h-11 rounded-xl border border-[#3C4166]/10 bg-white/80 px-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Submit area */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-[#6B6F8E]">
          <div className="flex items-center gap-2">
            {jobDescription ? (
              <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-[#3C4166]/20" />
            )}
            <span>Job description</span>
          </div>
          <div className="flex items-center gap-2">
            {resumeUploaded ? (
              <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-[#3C4166]/20" />
            )}
            <span>Resume</span>
          </div>
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <Link href="/dashboard" className="flex-1 sm:flex-initial">
            <Button variant="outline" className="w-full border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5">
              Cancel
            </Button>
          </Link>
          <Button 
            onClick={handleAnalyze}
            disabled={!jobDescription || !resumeUploaded}
            className="flex-1 sm:flex-initial bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7] hover:from-[#4FA7A7]/90 hover:to-[#7ED7F7]/90 text-white rounded-full px-8 shadow-lg shadow-[#4FA7A7]/20 hover:shadow-xl hover:shadow-[#4FA7A7]/30 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Analyze with Kestrel
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
