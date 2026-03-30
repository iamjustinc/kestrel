"use client"

import { useState } from "react"
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
  Lightbulb
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock resume data
const resumeBullets = [
  {
    id: 1,
    section: "Experience",
    company: "TechStart Inc.",
    role: "Associate Product Manager",
    original: "Led product launches for growth team",
    optimized: "Led 3 product launches driving 40% user growth and $2M ARR increase, managing cross-functional team of 8",
    keywords: ["product launches", "growth", "cross-functional"],
    status: "needs-improvement",
    impact: "high"
  },
  {
    id: 2,
    section: "Experience",
    company: "TechStart Inc.",
    role: "Associate Product Manager",
    original: "Worked with engineering team on product features",
    optimized: "Partnered with 8-person engineering team to ship 12 features, achieving 95% on-time delivery rate",
    keywords: ["engineering", "features", "delivery"],
    status: "needs-improvement",
    impact: "medium"
  },
  {
    id: 3,
    section: "Experience",
    company: "TechStart Inc.",
    role: "Associate Product Manager",
    original: "Analyzed user behavior to inform decisions",
    optimized: "Built SQL dashboards analyzing 500K+ user sessions monthly, informing roadmap prioritization and reducing churn by 15%",
    keywords: ["SQL", "analytics", "data-driven", "churn"],
    status: "needs-improvement",
    impact: "critical"
  },
  {
    id: 4,
    section: "Experience",
    company: "DataCorp",
    role: "Product Analyst",
    original: "Supported product managers with analysis",
    optimized: "Delivered 20+ strategic analyses supporting product decisions, contributing to features generating $500K revenue",
    keywords: ["strategic", "analysis", "revenue"],
    status: "needs-improvement",
    impact: "medium"
  },
  {
    id: 5,
    section: "Experience",
    company: "DataCorp",
    role: "Product Analyst",
    original: "Conducted A/B tests",
    optimized: "Designed and executed 12 A/B tests achieving 15% average conversion lift, establishing experimentation framework",
    keywords: ["A/B testing", "experimentation", "conversion"],
    status: "good",
    impact: "high"
  },
]

const keywordSuggestions = [
  { keyword: "SQL", importance: "Critical", status: "missing", context: "Add to skills or quantify in experience" },
  { keyword: "data-driven", importance: "High", status: "missing", context: "Frame decisions as data-informed" },
  { keyword: "A/B testing", importance: "High", status: "partial", context: "Strengthen with methodology details" },
  { keyword: "OKRs", importance: "Medium", status: "missing", context: "Mention goal-setting framework" },
  { keyword: "PRD", importance: "Medium", status: "missing", context: "Reference documentation skills" },
  { keyword: "roadmap", importance: "High", status: "present", context: "Already present - good!" },
  { keyword: "cross-functional", importance: "High", status: "present", context: "Already present - good!" },
  { keyword: "agile", importance: "Medium", status: "present", context: "Already present - good!" },
]

const framingSuggestions = [
  {
    title: "Lead with impact, not tasks",
    description: "Start bullets with outcomes and metrics, then explain how you achieved them.",
    example: "Instead of 'Managed product backlog' → 'Prioritized 200+ backlog items driving 30% velocity increase'"
  },
  {
    title: "Quantify everything possible",
    description: "Numbers make your experience concrete and comparable.",
    example: "Team size, users impacted, revenue generated, time saved, efficiency gains"
  },
  {
    title: "Use strong action verbs",
    description: "Choose verbs that demonstrate leadership and ownership.",
    example: "Led, Drove, Spearheaded, Architected, Launched, Scaled"
  },
  {
    title: "Show cross-functional impact",
    description: "Highlight collaboration across engineering, design, marketing, and leadership.",
    example: "Partnered with VP of Engineering to redesign sprint process, improving delivery by 25%"
  },
]

export default function ResumeLabPage() {
  const [expandedBullets, setExpandedBullets] = useState<number[]>([1, 3])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [selectedSection, setSelectedSection] = useState<"all" | "experience" | "skills">("all")

  const toggleExpanded = (id: number) => {
    setExpandedBullets(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const atsScore = 72
  const improvementPotential = 93

  return (
    <div className="pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166]">
            Resume Lab
          </h1>
          <p className="mt-1 text-[#6B6F8E]">
            Optimize your resume for maximum impact
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#3C4166]/15 text-[#3C4166]">
            <Download className="h-4 w-4 mr-2" />
            Export Optimized
          </Button>
          <Button className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            Reanalyze All
          </Button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#6B6F8E]">Current ATS Score</span>
              <Target className="h-4 w-4 text-[#6B6F8E]" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold text-[#E87BF1]">{atsScore}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4]"
                style={{ width: `${atsScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#6B6F8E]">Potential Score</span>
              <Zap className="h-4 w-4 text-[#4FA7A7]" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold text-[#4FA7A7]">{improvementPotential}%</span>
              <span className="text-sm text-[#4FA7A7] mb-1">+{improvementPotential - atsScore}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]"
                style={{ width: `${improvementPotential}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#4FA7A7]/10 to-[#7ED7F7]/10 border-[#4FA7A7]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#3C4166] font-medium">Quick Stats</span>
              <Settings2 className="h-4 w-4 text-[#4FA7A7]" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6F8E]">Bullets to improve</span>
                <span className="font-medium text-[#3C4166]">{resumeBullets.filter(b => b.status === "needs-improvement").length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6F8E]">Missing keywords</span>
                <span className="font-medium text-[#FF8FA3]">{keywordSuggestions.filter(k => k.status === "missing").length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6F8E]">High-impact changes</span>
                <span className="font-medium text-[#E87BF1]">{resumeBullets.filter(b => b.impact === "critical" || b.impact === "high").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bullet Optimization */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F7C7D4]/50 to-[#E87BF1]/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#E87BF1]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#3C4166]">Bullet Optimization</CardTitle>
                    <CardDescription className="text-[#6B6F8E]">Side-by-side before and after</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/10">
                  {(["all", "experience", "skills"] as const).map((section) => (
                    <button
                      key={section}
                      onClick={() => setSelectedSection(section)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
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
              {resumeBullets.map((bullet) => {
                const isExpanded = expandedBullets.includes(bullet.id)
                return (
                  <div 
                    key={bullet.id}
                    className={cn(
                      "border rounded-xl overflow-hidden transition-all",
                      bullet.status === "needs-improvement" 
                        ? "border-[#FF8FA3]/30 bg-[#FF8FA3]/5"
                        : "border-[#4FA7A7]/30 bg-[#4FA7A7]/5"
                    )}
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleExpanded(bullet.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {bullet.status === "needs-improvement" ? (
                          <AlertCircle className="h-5 w-5 text-[#FF8FA3]" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-[#4FA7A7]" />
                        )}
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#3C4166]">{bullet.company}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#3C4166]/10 text-[#6B6F8E]">
                              {bullet.role}
                            </span>
                          </div>
                          <p className="text-sm text-[#6B6F8E] line-clamp-1 mt-0.5">{bullet.original}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          bullet.impact === "critical"
                            ? "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                            : bullet.impact === "high"
                              ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                              : "bg-[#3C4166]/10 text-[#6B6F8E]"
                        )}>
                          {bullet.impact} impact
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-[#6B6F8E]" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-[#6B6F8E]" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4">
                        {/* Before/After comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-[#FF8FA3]/10 border border-[#FF8FA3]/20">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-[#FF8FA3]">BEFORE</span>
                            </div>
                            <p className="text-sm text-[#3C4166]">{bullet.original}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-[#4FA7A7]/10 border border-[#4FA7A7]/20">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-[#4FA7A7]">AFTER</span>
                              <Sparkles className="h-3 w-3 text-[#4FA7A7]" />
                            </div>
                            <p className="text-sm text-[#3C4166] font-medium">{bullet.optimized}</p>
                          </div>
                        </div>

                        {/* Keywords */}
                        <div>
                          <span className="text-xs font-medium text-[#6B6F8E] uppercase tracking-wider">Keywords added</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {bullet.keywords.map((kw) => (
                              <span 
                                key={kw}
                                className="text-xs px-2 py-0.5 rounded-full bg-[#C9B6E4]/20 text-[#6B6F8E]"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(bullet.optimized, bullet.id)}
                            className="border-[#4FA7A7] text-[#4FA7A7] hover:bg-[#4FA7A7]/10"
                          >
                            {copiedId === bullet.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1.5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 mr-1.5" />
                                Copy Optimized
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#6B6F8E] hover:text-[#3C4166]"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Framing Suggestions */}
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#7ED7F7]/30 to-[#4FA7A7]/20 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-[#4FA7A7]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">Framing Tips</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">Best practices for impactful bullets</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {framingSuggestions.map((tip) => (
                  <div 
                    key={tip.title}
                    className="p-4 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5"
                  >
                    <h4 className="font-medium text-[#3C4166] mb-1">{tip.title}</h4>
                    <p className="text-sm text-[#6B6F8E] mb-2">{tip.description}</p>
                    <p className="text-xs text-[#4FA7A7] bg-[#4FA7A7]/10 px-2 py-1 rounded-lg">
                      {tip.example}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Keyword Suggestions */}
        <div className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#C9B6E4]/30 to-[#E87BF1]/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-[#E87BF1]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#3C4166]">ATS Keywords</CardTitle>
                  <CardDescription className="text-[#6B6F8E]">For your target role</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {keywordSuggestions.map((kw) => (
                <div 
                  key={kw.keyword}
                  className={cn(
                    "p-3 rounded-xl border",
                    kw.status === "missing"
                      ? "bg-[#FF8FA3]/5 border-[#FF8FA3]/20"
                      : kw.status === "partial"
                        ? "bg-[#E87BF1]/5 border-[#E87BF1]/20"
                        : "bg-[#C8F5DF]/20 border-[#4FA7A7]/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {kw.status === "present" ? (
                        <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                      ) : kw.status === "partial" ? (
                        <AlertCircle className="h-4 w-4 text-[#E87BF1]" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-[#FF8FA3]" />
                      )}
                      <span className="font-medium text-[#3C4166]">{kw.keyword}</span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      kw.importance === "Critical"
                        ? "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                        : kw.importance === "High"
                          ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                          : "bg-[#3C4166]/10 text-[#6B6F8E]"
                    )}>
                      {kw.importance}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6F8E]">{kw.context}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ATS Alignment */}
          <Card className="bg-gradient-to-br from-[#4FA7A7]/10 to-[#7ED7F7]/10 border-[#4FA7A7]/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-[#3C4166] mb-2">ATS Alignment</h3>
                <p className="text-sm text-[#6B6F8E] mb-4">
                  Your resume matches <strong className="text-[#4FA7A7]">72%</strong> of keywords 
                  from your target PM role at Stripe.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#4FA7A7]">9</p>
                    <p className="text-xs text-[#6B6F8E]">Matched</p>
                  </div>
                  <div className="h-8 w-px bg-[#3C4166]/10" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#FF8FA3]">4</p>
                    <p className="text-xs text-[#6B6F8E]">Missing</p>
                  </div>
                  <div className="h-8 w-px bg-[#3C4166]/10" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#E87BF1]">2</p>
                    <p className="text-xs text-[#6B6F8E]">Partial</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4] border-0 text-white">
            <CardContent className="pt-6 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-90" />
              <h3 className="font-semibold mb-2">Apply all optimizations?</h3>
              <p className="text-sm text-white/80 mb-4">
                Update all bullets with AI-suggested improvements.
              </p>
              <Button className="bg-white text-[#E87BF1] hover:bg-white/90 rounded-full w-full">
                Apply All Changes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
