export function TrustStrip() {
  const companies = [
    "Stanford",
    "Berkeley", 
    "MIT",
    "Harvard",
    "Google",
    "Meta",
    "Amazon",
    "Microsoft"
  ]

  return (
    <section className="py-16 border-y border-[#3C4166]/5 bg-white/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-[#6B6F8E] mb-8">
          Trusted by students and professionals targeting top companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
          {companies.map((company) => (
            <div 
              key={company} 
              className="text-lg font-medium text-[#3C4166]/60 hover:text-[#3C4166] transition-colors"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
