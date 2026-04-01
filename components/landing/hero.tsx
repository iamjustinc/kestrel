"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section id="product" className="relative min-h-screen overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7C7D4]/18 via-[#F6F1E7] to-[#C9B6E4]/18" />

      <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-[#F7C7D4]/25 blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-16 right-10 h-80 w-80 rounded-full bg-[#C9B6E4]/20 blur-3xl animate-glow-pulse animation-delay-500" />
      <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7ED7F7]/8 blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(#3C4166 1px, transparent 1px), linear-gradient(90deg, #3C4166 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="animate-fade-in-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#3C4166]/10 bg-white/60 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[#E87BF1]" />
              <span className="text-sm text-[#6B6F8E]">AI-Powered Career Intelligence</span>
            </div>

            <h1 className="max-w-[680px] text-4xl font-semibold leading-[1.02] tracking-tight text-[#3C4166] sm:text-5xl lg:text-[78px]">
              Turn career chaos into a{" "}
              <span className="bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7] bg-clip-text text-transparent">
                clear, strategic roadmap
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#6B6F8E] sm:text-[19px]">
              Too many job descriptions. Conflicting expectations. Unclear next steps.
              Kestrel cuts through the noise to show you exactly how ready you are and what to do next.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="h-12 w-full rounded-full bg-[#4FA7A7] px-8 text-base text-white shadow-lg shadow-[#4FA7A7]/20 hover:bg-[#4FA7A7]/90 sm:w-auto"
                >
                  Start free analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/product-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-full border-[#3C4166]/20 bg-[#F6F1E7] px-8 text-base text-[#3C4166] hover:bg-white/70 sm:w-auto"
                >
                  View product demo
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-[#F6F1E7] bg-gradient-to-br from-[#C9B6E4] to-[#F7C7D4]"
                  />
                ))}
              </div>
              <div className="text-sm text-[#6B6F8E] sm:text-base">
                <span className="font-medium text-[#3C4166]">2,400+</span> career roadmaps created this month
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up animation-delay-200">
            <div className="relative rounded-[28px] border border-[#3C4166]/10 bg-white/72 p-5 shadow-xl shadow-[#3C4166]/5 backdrop-blur-sm lg:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-white"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-[#3C4166] sm:text-base">
                    Role Readiness Dashboard
                  </h3>
                  <p className="text-sm text-[#6B6F8E]">Product Manager at Stripe</p>
                </div>
              </div>

              <div className="mb-4 rounded-2xl bg-gradient-to-r from-[#C8F5DF]/45 to-[#7ED7F7]/25 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#3C4166]">Overall Readiness</span>
                  <span className="text-2xl font-semibold text-[#4FA7A7]">78%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/50">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]" />
                </div>
              </div>

              <div className="mb-4 space-y-3">
                <h4 className="text-sm font-medium text-[#3C4166]">Priority Skill Gaps</h4>
                {[
                  { skill: "SQL & Data Analysis", match: 45, color: "from-[#FF8FA3] to-[#F7C7D4]" },
                  {
                    skill: "Technical Documentation",
                    match: 62,
                    color: "from-[#E87BF1] to-[#C9B6E4]",
                  },
                  { skill: "A/B Testing", match: 71, color: "from-[#7ED7F7] to-[#4FA7A7]" },
                ].map((item) => (
                  <div key={item.skill} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-xs sm:text-sm">
                        <span className="text-[#6B6F8E]">{item.skill}</span>
                        <span className="text-[#3C4166]">{item.match}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#3C4166]/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          style={{ width: `${item.match}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#3C4166]">Next Steps</h4>
                {[
                  {
                    title: "Complete SQL fundamentals course",
                    tag: "High Impact",
                    tagColor: "bg-[#FF8FA3]/20 text-[#FF8FA3]",
                  },
                  {
                    title: "Add metrics to portfolio project",
                    tag: "Quick Win",
                    tagColor: "bg-[#C8F5DF] text-[#4FA7A7]",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-[#3C4166]/5 bg-white/55 p-3"
                  >
                    <span className="text-sm text-[#3C4166]">{item.title}</span>
                    <span className={`rounded-full px-2 py-1 text-xs ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 rounded-2xl border border-[#3C4166]/10 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C8F5DF]">
                  <svg
                    className="h-5 w-5 text-[#4FA7A7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#3C4166]">ATS Score: 92%</p>
                  <p className="text-xs text-[#6B6F8E]">Resume optimized</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 top-8 hidden rounded-2xl border border-[#3C4166]/10 bg-white px-4 py-3 shadow-lg md:block">
              <div className="flex items-center gap-3">
                <div className="animate-bounce">
                  <svg width="58" height="44" viewBox="0 0 58 44" fill="none">
                    <ellipse cx="25" cy="35" rx="13" ry="4" fill="#DDE8EE" />
                    <circle cx="21" cy="22" r="12" fill="#7ED7F7" />
                    <circle cx="33" cy="22" r="9" fill="#4FA7A7" />
                    <circle cx="38" cy="16" r="2.8" fill="#2D3436" />
                    <path d="M42 21L52 25L42 28V21Z" fill="#F7C7D4" />
                    <path d="M12 20C15 16 19 14 24 14" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                    <path d="M27 30C31 32 36 31 40 28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3C4166]">Kestrel is watching</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}