"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTABand() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-[#F7C7D4]/30 via-[#F6F1E7] to-[#C9B6E4]/30" />

      <div className="absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#7ED7F7]/20 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#E87BF1]/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3C4166]/10 bg-white/60 px-4 py-2 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-[#E87BF1]" />
          <span className="text-sm text-[#6B6F8E]">Free to start, no credit card required</span>
        </div>

        <h2 className="mb-6 text-3xl font-semibold text-[#3C4166] text-balance sm:text-4xl lg:text-5xl">
          Ready to turn career chaos into clarity?
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-[#6B6F8E] text-pretty">
          Join thousands of job seekers who have already used Kestrel to understand their
          readiness and build strategic roadmaps.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/sign-in">
            <Button
              size="lg"
              className="h-12 w-full rounded-full bg-[#4FA7A7] px-8 text-base text-white shadow-lg shadow-[#4FA7A7]/20 hover:bg-[#4FA7A7]/90 sm:w-auto"
            >
              Start your free analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/product-demo">
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full border-[#3C4166]/20 px-8 text-base text-[#3C4166] hover:bg-white/50 sm:w-auto"
            >
              Watch 2-min demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}