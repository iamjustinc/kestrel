"use client"

import { 
  Target, 
  TrendingUp, 
  FileText, 
  Search, 
  Map, 
  Bookmark,
  Sparkles
} from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Readiness Scoring",
    description: "Get an instant, data-driven assessment of how ready you are for any role based on your experience and skills.",
    gradient: "from-[#4FA7A7] to-[#7ED7F7]",
    bgGradient: "from-[#4FA7A7]/10 to-[#7ED7F7]/10",
    size: "large"
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Detection",
    description: "Identify exactly which skills are missing and how critical they are for your target roles.",
    gradient: "from-[#E87BF1] to-[#C9B6E4]",
    bgGradient: "from-[#E87BF1]/10 to-[#C9B6E4]/10",
    size: "medium"
  },
  {
    icon: FileText,
    title: "Resume Upgrade Suggestions",
    description: "Get specific, actionable recommendations to strengthen your resume for each target role.",
    gradient: "from-[#F7C7D4] to-[#FF8FA3]",
    bgGradient: "from-[#F7C7D4]/10 to-[#FF8FA3]/10",
    size: "medium"
  },
  {
    icon: Search,
    title: "ATS Keyword Alignment",
    description: "Ensure your resume passes automated screening with optimized keyword matching.",
    gradient: "from-[#7ED7F7] to-[#4FA7A7]",
    bgGradient: "from-[#7ED7F7]/10 to-[#4FA7A7]/10",
    size: "small"
  },
  {
    icon: Map,
    title: "Next Steps Strategy",
    description: "Get a prioritized action plan with specific certifications, projects, and experiences.",
    gradient: "from-[#C9B6E4] to-[#E87BF1]",
    bgGradient: "from-[#C9B6E4]/10 to-[#E87BF1]/10",
    size: "small"
  },
  {
    icon: Bookmark,
    title: "Saved Analyses",
    description: "Track your progress over time with saved analyses and improvement metrics.",
    gradient: "from-[#C8F5DF] to-[#4FA7A7]",
    bgGradient: "from-[#C8F5DF]/10 to-[#4FA7A7]/10",
    size: "small"
  }
]

export function FeaturesBento() {
  return (
    <section id="product" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F6F1E7] via-white/50 to-[#F6F1E7]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E87BF1]/10 border border-[#E87BF1]/20 mb-6">
            <Sparkles className="h-4 w-4 text-[#E87BF1]" />
            <span className="text-sm text-[#E87BF1]">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#3C4166] mb-4 text-balance">
            Everything you need to navigate your career
          </h2>
          <p className="text-lg text-[#6B6F8E] max-w-2xl mx-auto text-pretty">
            Kestrel combines AI analysis with strategic career planning to give you 
            a complete picture of where you stand and where to go next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large feature card */}
          <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <FeatureCard feature={features[0]} isLarge />
          </div>

          {/* Medium feature cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FeatureCard feature={features[1]} />
              <FeatureCard feature={features[2]} />
            </div>
          </div>

          {/* Small feature cards */}
          <FeatureCard feature={features[3]} />
          <FeatureCard feature={features[4]} />
          <FeatureCard feature={features[5]} />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ 
  feature, 
  isLarge = false 
}: { 
  feature: typeof features[0]
  isLarge?: boolean 
}) {
  const Icon = feature.icon

  return (
    <div 
      className={`group relative rounded-2xl bg-white/70 backdrop-blur-sm border border-[#3C4166]/10 p-6 hover:shadow-lg hover:shadow-[#3C4166]/5 transition-all duration-300 overflow-hidden ${
        isLarge ? 'h-full flex flex-col' : ''
      }`}
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative">
        <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <h3 className={`font-semibold text-[#3C4166] mb-2 ${isLarge ? 'text-xl' : 'text-lg'}`}>
          {feature.title}
        </h3>
        
        <p className={`text-[#6B6F8E] leading-relaxed ${isLarge ? 'text-base' : 'text-sm'}`}>
          {feature.description}
        </p>

        {isLarge && (
          <div className="mt-8 flex-1 flex items-end">
            <div className="w-full rounded-xl bg-gradient-to-br from-[#F6F1E7] to-white p-4 border border-[#3C4166]/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#6B6F8E]">Your Readiness</span>
                <span className="text-2xl font-semibold text-[#4FA7A7]">78%</span>
              </div>
              <div className="h-3 rounded-full bg-[#3C4166]/10 overflow-hidden">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]" />
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-[#C8F5DF] text-[#4FA7A7]">3 skills aligned</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#FF8FA3]/20 text-[#FF8FA3]">2 gaps found</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
