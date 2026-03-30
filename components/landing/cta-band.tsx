"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTABand() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F7C7D4]/30 via-[#F6F1E7] to-[#C9B6E4]/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#7ED7F7]/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-[#E87BF1]/20 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#3C4166]/10 mb-6">
          <Sparkles className="h-4 w-4 text-[#E87BF1]" />
          <span className="text-sm text-[#6B6F8E]">Free to start, no credit card required</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3C4166] mb-6 text-balance">
          Ready to turn career chaos into clarity?
        </h2>
        
        <p className="text-lg text-[#6B6F8E] mb-8 max-w-2xl mx-auto text-pretty">
          Join thousands of job seekers who have already used Kestrel to understand 
          their readiness and build strategic roadmaps.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-full px-8 h-12 text-base shadow-lg shadow-[#4FA7A7]/20 w-full sm:w-auto"
            >
              Start your free analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-8 h-12 text-base border-[#3C4166]/20 text-[#3C4166] hover:bg-white/50 w-full sm:w-auto"
            >
              Watch 2-min demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
