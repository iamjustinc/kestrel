"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Target, 
  TrendingUp, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download,
  Share2,
  Bookmark,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Clock,
  Zap,
  Award,
  Briefcase,
  BarChart3,
  Lightbulb,
  Star,
  BookOpen,
  Layers
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Comprehensive analysis data
const analysisData = {
  role: "Product Manager",
  company: "Stripe",
  readinessScore: 78,
  confidenceLevel: "High",
  atsScore: 85,
  analyzedAt: "Just now",
  matchSummary: "Strong foundation with excellent cross-functional experience. Key gaps in data/SQL skills and experimentation methodology. High potential with targeted upskilling.",
  
  strengths: [
    { skill: "Product Strategy", level: "Strong", evidence: "Led product roadmap for growth team, 3 successful launches", icon: Target },
    { skill: "Cross-functional Leadership", level: "Strong", evidence: "Managed eng, design, marketing teams across 5 projects", icon: Briefcase },
    { skill: "User Research", level: "Advanced", evidence: "Conducted 50+ user interviews, designed research frameworks", icon: Lightbulb },
    { skill: "Agile/Scrum", level: "Strong", evidence: "Scrum master certified, led 2-week sprint cycles", icon: Zap },
    { skill: "Stakeholder Management", level: "Strong", evidence: "Regular executive presentations, managed C-suite relationships", icon: Star },
  ],
  
  skillGaps: {
    technical: [
      { skill: "SQL & Data Analysis", importance: "Critical", currentLevel: 45, suggestion: "Complete Mode SQL course and build a dashboard project" },
      { skill: "A/B Testing & Experimentation", importance: "High", currentLevel: 55, suggestion: "Run an A/B test on a side project and document methodology" },
    ],
    productBusiness: [
      { skill: "Revenue Modeling", importance: "Medium", currentLevel: 60, suggestion: "Create financial models for past product launches" },
      { skill: "Competitive Analysis", importance: "Medium", currentLevel: 65, suggestion: "Write a competitive analysis document for portfolio" },
    ],
    communication: [
      { skill: "Technical Documentation", importance: "High", currentLevel: 58, suggestion: "Write 2 PRDs for past projects to showcase" },
    ],
    toolsPlatforms: [
      { skill: "Amplitude/Mixpanel", importance: "High", currentLevel: 40, suggestion: "Get Amplitude certification (free)" },
      { skill: "Figma Basics", importance: "Low", currentLevel: 70, suggestion: "Can communicate with design but limited hands-on" },
    ]
  },
  
  atsKeywords: {
    matched: ["product management", "roadmap", "cross-functional", "agile", "user research", "stakeholder management", "product strategy", "sprints", "backlog"],
    missing: ["SQL", "A/B testing", "data-driven", "metrics", "OKRs", "PRD", "Amplitude", "experimentation", "hypothesis"],
    score: 85
  },
  
  resumeSuggestions: [
    { 
      type: "add", 
      title: "Quantify impact metrics",
      current: "Led product launches for growth team",
      improved: "Led 3 product launches driving 40% user growth and $2M ARR increase",
      impact: "High"
    },
    { 
      type: "reframe", 
      title: "Strengthen data narrative",
      current: "Analyzed user behavior to inform decisions",
      improved: "Built SQL dashboards analyzing 500K+ user sessions, informing roadmap prioritization",
      impact: "High"
    },
    { 
      type: "add", 
      title: "Add experimentation experience",
      current: null,
      improved: "Designed and executed 12 A/B tests achieving 15% conversion lift",
      impact: "Critical"
    },
    { 
      type: "reframe", 
      title: "Emphasize technical collaboration",
      current: "Worked with engineering team",
      improved: "Partnered with 8-person engineering team on technical spec reviews and API design decisions",
      impact: "Medium"
    },
  ],
  
  nextSteps: {
    now: [
      { action: "Update resume with quantified metrics", effort: "2 hours", impact: "High" },
      { action: "Add missing ATS keywords to experience section", effort: "1 hour", impact: "High" },
    ],
    soon: [
      { action: "Complete SQL fundamentals course", effort: "2 weeks", impact: "Critical" },
      { action: "Write 2 PRDs for portfolio", effort: "1 week", impact: "High" },
      { action: "Get Amplitude certification", effort: "3 days", impact: "Medium" },
    ],
    later: [
      { action: "Run A/B test on side project", effort: "2-3 weeks", impact: "High" },
      { action: "Build data analysis portfolio project", effort: "2 weeks", impact: "High" },
    ]
  },
  
  certifications: [
    { name: "Amplitude Analytics Certification", provider: "Amplitude", time: "3-5 hours", relevance: "High", free: true },
    { name: "Google Analytics 4", provider: "Google", time: "4-6 hours", relevance: "Medium", free: true },
    { name: "Product School PM Certification", provider: "Product School", time: "8 weeks", relevance: "High", free: false },
  ],
  
  projectIdeas: [
    { title: "E-commerce Analytics Dashboard", complexity: "Medium", signal: "High", description: "Build a SQL-powered dashboard showing conversion funnels and user cohorts" },
    { title: "A/B Testing Case Study", complexity: "Medium", signal: "High", description: "Document an A/B test from hypothesis to results with statistical analysis" },
    { title: "Product Teardown: Stripe", complexity: "Low", signal: "Medium", description: "Write a detailed analysis of Stripe's product strategy and UX decisions" },
  ],
  
  marketSignals: {
    themes: ["Data-driven decision making", "Cross-functional leadership", "Technical fluency", "Experimentation culture"],
    expectations: ["3-5 years PM experience", "SQL proficiency", "B2B SaaS background preferred", "Fintech domain knowledge a plus"],
    salaryRange: "$150K - $200K",
    demandLevel: "High"
  }
}

export default function AnalysisResultsPage() {
  const [expandedGaps, setExpandedGaps] = useState<string[]>(["technical"])
  const [savedSuggestions, setSavedSuggestions] = useState<number[]>([])

  const toggleGapCategory = (category: string) => {
    setExpandedGaps(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  return (
    <div className="pb-20 lg:pb-0">
      {/* Hero Card - Primary Focal Point */}
      <Card className="mb-8 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-[#3C4166]/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4FA7A7]/10 via-[#7ED7F7]/10 to-[#C9B6E4]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <CardContent className="pt-8 pb-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Left: Score & Info */}
            <div className="flex items-start gap-6">
              {/* Radial Score */}
              <div className="relative flex-shrink-0">
                <svg className="w-32 h-32 -rotate-90">
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
                  <span className="text-4xl font-bold text-[#3C4166]">{analysisData.readinessScore}</span>
                  <span className="text-xs text-[#6B6F8E]">Readiness</span>
                </div>
              </div>

              {/* Role & Summary */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#4FA7A7]/10 text-[#4FA7A7] text-xs font-medium">
                    {analysisData.confidenceLevel} Confidence
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#C9B6E4]/20 text-[#6B6F8E] text-xs">
                    {analysisData.analyzedAt}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166] mb-1">
                  {analysisData.role}
                </h1>
                <p className="text-lg text-[#6B6F8E] mb-4">at {analysisData.company}</p>
                <p className="text-sm text-[#6B6F8E] leading-relaxed max-w-xl">
                  {analysisData.matchSummary}
                </p>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex flex-wrap lg:flex-col gap-2">
              <Button variant="outline" size="sm" className="border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5">
                <Bookmark className="h-4 w-4 mr-2" />
                Save Analysis
              </Button>
              <Button variant="outline" size="sm" className="border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" className="border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5">
                <Share2 className="h-4 w-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1-2: Primary Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Strengths Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#C8F5DF] to-[#4FA7A7]/30 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-[#4FA7A7]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">Your Strengths</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">What you already bring to this role</CardDescription>
                  </div>
                </div>
                <span className="text-sm font-medium text-[#4FA7A7]">{analysisData.strengths.length} matched</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisData.strengths.map((strength) => {
                  const Icon = strength.icon
                  return (
                    <div 
                      key={strength.skill}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-[#C8F5DF]/30 to-transparent border border-[#4FA7A7]/10"
                    >
                      <div className="h-10 w-10 rounded-xl bg-[#4FA7A7]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-[#4FA7A7]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-medium text-[#3C4166]">{strength.skill}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#C8F5DF] text-[#4FA7A7] flex-shrink-0">
                            {strength.level}
                          </span>
                        </div>
                        <p className="text-sm text-[#6B6F8E]">{strength.evidence}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Skill Gaps Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF8FA3]/20 to-[#E87BF1]/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[#E87BF1]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Skill Gaps to Address</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Organized by category for focused improvement</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(analysisData.skillGaps).map(([category, gaps]) => {
                const isExpanded = expandedGaps.includes(category)
                const categoryLabels: Record<string, string> = {
                  technical: "Technical Skills",
                  productBusiness: "Product & Business",
                  communication: "Communication",
                  toolsPlatforms: "Tools & Platforms"
                }
                const categoryColors: Record<string, string> = {
                  technical: "from-[#FF8FA3] to-[#F7C7D4]",
                  productBusiness: "from-[#E87BF1] to-[#C9B6E4]",
                  communication: "from-[#7ED7F7] to-[#4FA7A7]",
                  toolsPlatforms: "from-[#C9B6E4] to-[#F7C7D4]"
                }
                return (
                  <div key={category} className="border border-[#3C4166]/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleGapCategory(category)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#F6F1E7]/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("h-2 w-2 rounded-full bg-gradient-to-r", categoryColors[category])} />
                        <span className="font-medium text-[#3C4166]">{categoryLabels[category]}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#3C4166]/10 text-[#6B6F8E]">
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
                      <div className="px-4 pb-4 space-y-3">
                        {gaps.map((gap) => (
                          <div key={gap.skill} className="p-4 rounded-xl bg-[#F6F1E7]/50">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-[#3C4166]">{gap.skill}</h4>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                gap.importance === "Critical" 
                                  ? "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                                  : gap.importance === "High"
                                    ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                                    : "bg-[#7ED7F7]/20 text-[#4FA7A7]"
                              )}>
                                {gap.importance}
                              </span>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-[#6B6F8E] mb-1">
                                <span>Current Level</span>
                                <span>{gap.currentLevel}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
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
                              <span className="font-medium text-[#3C4166]">Action:</span> {gap.suggestion}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Resume Upgrade Suggestions */}
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F7C7D4]/50 to-[#E87BF1]/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-[#E87BF1]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Resume Upgrade Suggestions</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Before vs after improvements</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisData.resumeSuggestions.map((suggestion, i) => (
                <div 
                  key={i}
                  className="p-4 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        suggestion.type === "add"
                          ? "bg-[#C8F5DF] text-[#4FA7A7]"
                          : "bg-[#7ED7F7]/20 text-[#4FA7A7]"
                      )}>
                        {suggestion.type === "add" ? "Add" : "Reframe"}
                      </span>
                      <span className="text-sm font-medium text-[#3C4166]">{suggestion.title}</span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      suggestion.impact === "Critical"
                        ? "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                        : suggestion.impact === "High"
                          ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                          : "bg-[#3C4166]/10 text-[#6B6F8E]"
                    )}>
                      {suggestion.impact} Impact
                    </span>
                  </div>
                  <div className="space-y-2">
                    {suggestion.current && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-[#FF8FA3] mt-1">Before:</span>
                        <p className="text-sm text-[#6B6F8E] line-through">{suggestion.current}</p>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-[#4FA7A7] mt-1">After:</span>
                      <p className="text-sm text-[#3C4166] font-medium">{suggestion.improved}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[#4FA7A7] hover:text-[#4FA7A7] hover:bg-[#4FA7A7]/10 h-8"
                      onClick={() => {
                        navigator.clipboard.writeText(suggestion.improved)
                        setSavedSuggestions(prev => [...prev, i])
                      }}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      {savedSuggestions.includes(i) ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Next Steps Strategy */}
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4FA7A7]/20 to-[#7ED7F7]/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-[#4FA7A7]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Next Steps Strategy</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Prioritized actions to improve your match</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Now */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-[#4FA7A7] flex items-center justify-center">
                      <Zap className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h4 className="font-semibold text-[#3C4166]">Do Now</h4>
                    <span className="text-xs text-[#6B6F8E]">Quick wins</span>
                  </div>
                  <div className="space-y-2 ml-8">
                    {analysisData.nextSteps.now.map((step, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#C8F5DF]/20 border border-[#4FA7A7]/10">
                        <span className="text-sm text-[#3C4166]">{step.action}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#6B6F8E] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {step.effort}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            step.impact === "High" ? "bg-[#E87BF1]/20 text-[#E87BF1]" : "bg-[#3C4166]/10 text-[#6B6F8E]"
                          )}>
                            {step.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Soon */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-[#E87BF1] flex items-center justify-center">
                      <Clock className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h4 className="font-semibold text-[#3C4166]">Do Soon</h4>
                    <span className="text-xs text-[#6B6F8E]">This week</span>
                  </div>
                  <div className="space-y-2 ml-8">
                    {analysisData.nextSteps.soon.map((step, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#E87BF1]/10 border border-[#E87BF1]/10">
                        <span className="text-sm text-[#3C4166]">{step.action}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#6B6F8E] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {step.effort}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            step.impact === "Critical" 
                              ? "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                              : step.impact === "High" 
                                ? "bg-[#E87BF1]/20 text-[#E87BF1]" 
                                : "bg-[#3C4166]/10 text-[#6B6F8E]"
                          )}>
                            {step.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Later */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-[#7ED7F7] flex items-center justify-center">
                      <Target className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h4 className="font-semibold text-[#3C4166]">Do Later</h4>
                    <span className="text-xs text-[#6B6F8E]">This month</span>
                  </div>
                  <div className="space-y-2 ml-8">
                    {analysisData.nextSteps.later.map((step, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#7ED7F7]/10 border border-[#7ED7F7]/10">
                        <span className="text-sm text-[#3C4166]">{step.action}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#6B6F8E] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {step.effort}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            step.impact === "High" ? "bg-[#E87BF1]/20 text-[#E87BF1]" : "bg-[#3C4166]/10 text-[#6B6F8E]"
                          )}>
                            {step.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Supporting Content */}
        <div className="space-y-6">
          
          {/* ATS Keywords Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#7ED7F7]/30 to-[#4FA7A7]/20 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-[#4FA7A7]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">ATS Score</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">Keyword alignment</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#4FA7A7]">{analysisData.atsKeywords.score}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-[#3C4166] mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                  Found in Resume
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysisData.atsKeywords.matched.map((keyword) => (
                    <span 
                      key={keyword}
                      className="text-xs px-2 py-1 rounded-full bg-[#C8F5DF]/50 text-[#4FA7A7] border border-[#4FA7A7]/10"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#3C4166] mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[#FF8FA3]" />
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysisData.atsKeywords.missing.map((keyword) => (
                    <span 
                      key={keyword}
                      className="text-xs px-2 py-1 rounded-full bg-[#FF8FA3]/10 text-[#FF8FA3] border border-[#FF8FA3]/10"
                    >
                      + {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#C9B6E4]/30 to-[#E87BF1]/20 flex items-center justify-center">
                  <Award className="h-5 w-5 text-[#E87BF1]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Certifications</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Recommended credentials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisData.certifications.map((cert) => (
                <div 
                  key={cert.name}
                  className="p-3 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-[#3C4166]">{cert.name}</h4>
                    {cert.free && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#C8F5DF] text-[#4FA7A7]">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B6F8E] mb-2">{cert.provider}</p>
                  <div className="flex items-center gap-3 text-xs text-[#6B6F8E]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {cert.time}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full",
                      cert.relevance === "High" 
                        ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                        : "bg-[#3C4166]/10"
                    )}>
                      {cert.relevance} relevance
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Project Ideas Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F7C7D4]/50 to-[#FF8FA3]/20 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-[#FF8FA3]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Project Ideas</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Portfolio suggestions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisData.projectIdeas.map((project) => (
                <div 
                  key={project.title}
                  className="p-3 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-[#3C4166]">{project.title}</h4>
                  </div>
                  <p className="text-xs text-[#6B6F8E] mb-2">{project.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#3C4166]/10 text-[#6B6F8E]">
                      {project.complexity}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      project.signal === "High" 
                        ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                        : "bg-[#3C4166]/10 text-[#6B6F8E]"
                    )}>
                      {project.signal} signal
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Market Signals Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4FA7A7]/20 to-[#7ED7F7]/30 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-[#4FA7A7]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Market Signals</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Industry trends</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-[#6B6F8E] uppercase tracking-wider mb-2">Recurring Themes</h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysisData.marketSignals.themes.map((theme) => (
                    <span 
                      key={theme}
                      className="text-xs px-2 py-1 rounded-full bg-[#4FA7A7]/10 text-[#4FA7A7]"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium text-[#6B6F8E] uppercase tracking-wider mb-2">Common Expectations</h4>
                <ul className="space-y-1.5">
                  {analysisData.marketSignals.expectations.map((exp) => (
                    <li key={exp} className="text-xs text-[#3C4166] flex items-start gap-2">
                      <span className="text-[#4FA7A7] mt-0.5">•</span>
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-3 border-t border-[#3C4166]/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B6F8E]">Salary Range</span>
                  <span className="font-medium text-[#3C4166]">{analysisData.marketSignals.salaryRange}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-[#6B6F8E]">Demand</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#C8F5DF] text-[#4FA7A7] text-xs">
                    {analysisData.marketSignals.demandLevel}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <Card className="mt-8 bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7] border-0 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <CardContent className="py-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Ready to close the gap?</h3>
              <p className="text-white/90">
                View your personalized roadmap with prioritized steps to reach your target role
              </p>
            </div>
            <Link href="/dashboard/roadmap">
              <Button 
                size="lg"
                className="bg-white text-[#4FA7A7] hover:bg-white/90 rounded-full px-8 shadow-lg"
              >
                View My Roadmap
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
