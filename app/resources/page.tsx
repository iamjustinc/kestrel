import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const resources = [
  {
    title: "How to break into product management",
    description: "A structured approach to transitioning into PM roles.",
    href: "/resources/break-into-pm",
  },
  {
    title: "What hiring managers actually look for",
    description: "Decode job descriptions and hidden expectations.",
    href: "/resources/what-hiring-managers-look-for",
  },
  {
    title: "Building a portfolio that gets interviews",
    description: "Turn your experience into signal, not noise.",
    href: "/resources/portfolio-that-gets-interviews",
  },
  {
    title: "Understanding role readiness",
    description: "How to measure if you’re actually ready to apply.",
    href: "/resources/understanding-role-readiness",
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#F6F1E7] px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-[#6B6F8E] hover:text-[#3C4166]">
          ← Back to home
        </Link>

        <div className="mt-10 text-center">
          <h1 className="text-4xl font-semibold text-[#3C4166] sm:text-5xl">
            Resources
          </h1>
          <p className="mt-4 text-lg text-[#6B6F8E]">
            Learn how to navigate your career with clarity and strategy.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {resources.map((item) => (
            <div
              key={item.href}
              className="rounded-2xl border border-[#3C4166]/10 bg-white/70 p-6 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-[#3C4166]">
                {item.title}
              </h3>

              <p className="mt-2 text-[#6B6F8E]">
                {item.description}
              </p>

              <Link href={item.href}>
                <Button
                  variant="ghost"
                  className="mt-4 px-0 text-[#4FA7A7] hover:bg-transparent hover:text-[#3C4166]"
                >
                  Read article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/sign-up">
            <Button className="rounded-full bg-[#4FA7A7] px-6 text-white hover:bg-[#4FA7A7]/90">
              Start free analysis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}