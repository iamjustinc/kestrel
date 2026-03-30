"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7C7D4]/20 via-[#F6F1E7] to-[#C9B6E4]/20" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#F7C7D4]/30 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C9B6E4]/30 rounded-full blur-3xl animate-glow-pulse animation-delay-500" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7ED7F7]/10 rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(#3C4166 1px, transparent 1px), linear-gradient(90deg, #3C4166 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#3C4166]/10 mb-6">
              <Sparkles className="h-4 w-4 text-[#E87BF1]" />
              <span className="text-sm text-[#6B6F8E]">AI-Powered Career Intelligence</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#3C4166] leading-tight tracking-tight text-balance">
              Turn career chaos into a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]">
                clear, strategic roadmap
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-[#6B6F8E] leading-relaxed max-w-xl text-pretty">
              Too many job descriptions. Conflicting expectations. Unclear next steps. 
              Kestrel cuts through the noise to show you exactly how ready you are 
              and what to do next.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-full px-8 h-12 text-base shadow-lg shadow-[#4FA7A7]/20 w-full sm:w-auto"
                >
                  Start free analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-8 h-12 text-base border-[#3C4166]/20 text-[#3C4166] hover:bg-white/50 w-full sm:w-auto"
                >
                  View product demo
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-[#F6F1E7] bg-gradient-to-br from-[#C9B6E4] to-[#F7C7D4]"
                  />
                ))}
              </div>
              <div className="text-sm text-[#6B6F8E]">
                <span className="font-medium text-[#3C4166]">2,400+</span> career roadmaps created this month
              </div>
            </div>
          </div>

          {/* Right side - Product mockup */}
          <div className="animate-fade-in-up animation-delay-200 relative">
            <div className="relative rounded-2xl bg-white/70 backdrop-blur-sm border border-[#3C4166]/10 shadow-xl shadow-[#3C4166]/5 p-6 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Mockup header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-[#3C4166]">Role Readiness Dashboard</h3>
                  <p className="text-sm text-[#6B6F8E]">Product Manager at Stripe</p>
                </div>
              </div>

              {/* Readiness Score */}
              <div className="bg-gradient-to-r from-[#C8F5DF]/50 to-[#7ED7F7]/30 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#3C4166]">Overall Readiness</span>
                  <span className="text-2xl font-semibold text-[#4FA7A7]">78%</span>
                </div>
                <div className="h-2 rounded-full bg-white/50 overflow-hidden">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]" />
                </div>
              </div>

              {/* Skill gaps */}
              <div className="space-y-3 mb-4">
                <h4 className="text-sm font-medium text-[#3C4166]">Priority Skill Gaps</h4>
                {[
                  { skill: "SQL & Data Analysis", match: 45, color: "from-[#FF8FA3] to-[#F7C7D4]" },
                  { skill: "Technical Documentation", match: 62, color: "from-[#E87BF1] to-[#C9B6E4]" },
                  { skill: "A/B Testing", match: 71, color: "from-[#7ED7F7] to-[#4FA7A7]" },
                ].map((item) => (
                  <div key={item.skill} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6B6F8E]">{item.skill}</span>
                        <span className="text-[#3C4166]">{item.match}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#3C4166]/10 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          style={{ width: `${item.match}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Roadmap cards */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#3C4166]">Next Steps</h4>
                {[
                  { title: "Complete SQL fundamentals course", tag: "High Impact", tagColor: "bg-[#FF8FA3]/20 text-[#FF8FA3]" },
                  { title: "Add metrics to portfolio project", tag: "Quick Win", tagColor: "bg-[#C8F5DF] text-[#4FA7A7]" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-[#3C4166]/5">
                    <span className="text-sm text-[#3C4166]">{item.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.tagColor}`}>{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating accent card */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-[#3C4166]/10 animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#C8F5DF] flex items-center justify-center">
                  <svg className="h-5 w-5 text-[#4FA7A7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#3C4166]">ATS Score: 92%</p>
                  <p className="text-xs text-[#6B6F8E]">Resume optimized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
