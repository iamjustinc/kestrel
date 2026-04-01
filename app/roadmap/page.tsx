"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const roadmapItems = [
  {
    title: "AI Resume Intelligence",
    description: "Instantly analyze your resume against real job descriptions with actionable feedback.",
    status: "Live",
  },
  {
    title: "Role Readiness Scoring",
    description: "Understand how ready you are for specific roles with breakdowns across skills.",
    status: "Live",
  },
  {
    title: "Personalized Roadmaps",
    description: "Get step-by-step plans tailored to your target roles and current gaps.",
    status: "In Progress",
  },
  {
    title: "Live Job Matching",
    description: "See which real job listings you’re closest to landing right now.",
    status: "Coming Soon",
  },
  {
    title: "Auto Portfolio Builder",
    description: "Turn your experience into portfolio-ready projects aligned with target roles.",
    status: "Coming Soon",
  },
]

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-[#F6F1E7] px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-[#6B6F8E] hover:text-[#3C4166]">
          ← Back to home
        </Link>

        <div className="mt-10 text-center">
          <h1 className="text-4xl font-semibold text-[#3C4166] sm:text-5xl">
            Kestrel product roadmap
          </h1>
          <p className="mt-4 text-lg text-[#6B6F8E]">
            What we’re building to help you go from confusion to clarity.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {roadmapItems.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#3C4166]/10 bg-white/70 p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#3C4166]">
                  {item.title}
                </h3>
                <span className="text-sm text-[#6B6F8E]">
                  {item.status}
                </span>
              </div>

              <p className="mt-2 text-[#6B6F8E]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-[#6B6F8E] mb-4">
            Want to try what’s already live?
          </p>
          <Link href="/sign-up">
            <Button className="bg-[#4FA7A7] text-white rounded-full px-6">
              Start free analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}