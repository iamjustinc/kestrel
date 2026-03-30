import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { TrustStrip } from "@/components/landing/trust-strip"
import { FeaturesBento } from "@/components/landing/features-bento"
import { HowItWorks } from "@/components/landing/how-it-works"
import { RecruiterSection } from "@/components/landing/recruiter-section"
import { CTABand } from "@/components/landing/cta-band"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F6F1E7]">
      <Navbar />
      <Hero />
      <TrustStrip />
      <FeaturesBento />
      <HowItWorks />
      <RecruiterSection />
      <CTABand />
      <Footer />
    </main>
  )
}
