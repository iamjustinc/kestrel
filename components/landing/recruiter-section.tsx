"use client"

import { CheckCircle2, Users } from "lucide-react"

const benefits = [
  "Clear skill-to-requirement mapping",
  "Quantified experience relevance",
  "Demonstrated initiative and preparation",
  "Role-specific project examples",
  "Certifications aligned with job needs"
]

export function RecruiterSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3C4166] via-[#3C4166] to-[#4FA7A7]/40" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Users className="h-4 w-4 text-[#7ED7F7]" />
              <span className="text-sm text-white/80">For Recruiters & Hiring Managers</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6 text-balance">
              Candidates who use Kestrel stand out
            </h2>
            
            <p className="text-lg text-white/70 leading-relaxed mb-8 text-pretty">
              When candidates come prepared with clear role alignment, specific skill evidence, 
              and demonstrated initiative, everyone wins. Kestrel helps job seekers speak your language.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#C8F5DF] flex-shrink-0" />
                  <span className="text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right visual */}
          <div className="relative">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 lg:p-8">
              {/* Mock candidate card */}
              <div className="bg-white rounded-xl p-5 mb-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#C9B6E4] to-[#F7C7D4]" />
                  <div>
                    <h4 className="font-semibold text-[#3C4166]">Sarah Chen</h4>
                    <p className="text-sm text-[#6B6F8E]">Product Manager Candidate</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C8F5DF] text-sm font-medium text-[#4FA7A7]">
                      92% Match
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#6B6F8E]">Technical Skills</span>
                      <span className="text-[#3C4166]">85%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                      <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#6B6F8E]">Experience Alignment</span>
                      <span className="text-[#3C4166]">94%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                      <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#6B6F8E]">Initiative Score</span>
                      <span className="text-[#3C4166]">97%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                      <div className="h-full w-[97%] rounded-full bg-gradient-to-r from-[#C8F5DF] to-[#4FA7A7]" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {["SQL Certified", "Shipped 3 Products", "User Research", "A/B Testing"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full bg-white/20 text-sm text-white/90">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Decorative glow */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-[#7ED7F7]/20 to-[#E87BF1]/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
