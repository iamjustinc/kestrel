"use client"

import { Upload, Cpu, MapPin } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Add messy inputs",
    description: "Paste job descriptions, upload your resume, and add any context about your experience. Kestrel handles the chaos.",
    color: "#F7C7D4",
    iconColor: "#3C4166"
  },
  {
    number: "02",
    icon: Cpu,
    title: "Kestrel analyzes the signal",
    description: "Our AI extracts requirements, matches your skills, identifies gaps, and calculates your readiness score.",
    color: "#C9B6E4",
    iconColor: "#3C4166"
  },
  {
    number: "03",
    icon: MapPin,
    title: "Get your prioritized roadmap",
    description: "Receive a clear action plan with specific next steps, ranked by impact on your target role.",
    color: "#7ED7F7",
    iconColor: "#3C4166"
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9B6E4]/10 via-[#F6F1E7] to-[#F7C7D4]/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#F7C7D4]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C9B6E4]/20 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#3C4166] mb-4 text-balance">
            From confusion to clarity in minutes
          </h2>
          <p className="text-lg text-[#6B6F8E] max-w-2xl mx-auto text-pretty">
            No more guessing. No more endless research. Just a clear path forward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative group">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-px bg-gradient-to-r from-[#3C4166]/20 to-transparent" />
                )}
                
                <div className="text-center">
                  {/* Step number */}
                  <span className="inline-block text-sm font-medium text-[#6B6F8E] mb-4">
                    Step {step.number}
                  </span>
                  
                  {/* Icon */}
                  <div 
                    className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: step.color }}
                  >
                    <Icon className="h-8 w-8" style={{ color: step.iconColor }} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-[#3C4166] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#6B6F8E] leading-relaxed text-pretty">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
