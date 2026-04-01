import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductDemoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F6F1E7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute left-10 top-16 h-72 w-72 rounded-full bg-[#F7C7D4]/30 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#7ED7F7]/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9B6E4]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-8 rounded-full px-4 text-[#3C4166] hover:bg-white/60 hover:text-[#3C4166]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
        </Link>

        <div className="rounded-[2.5rem] border border-[#3C4166]/10 bg-white/70 p-8 shadow-xl shadow-[#3C4166]/5 backdrop-blur-xl sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3C4166]/10 bg-white/70 px-4 py-2">
              <Sparkles className="h-4 w-4 text-[#E87BF1]" />
              <span className="text-sm text-[#6B6F8E]">Kestrel product preview</span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-[#3C4166] sm:text-5xl">
              Coming very soon
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#6B6F8E]">
              We’re polishing the guided demo so it feels as sharp as the actual product. For now,
              the best way to explore Kestrel is to start the sign-up flow and enter the dashboard.
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#7ED7F7]/30 blur-2xl" />
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-[#A8D0D0] bg-gradient-to-br from-white to-[#F8FCFC] shadow-lg">
                <div className="animate-bounce">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <ellipse cx="58" cy="88" rx="26" ry="10" fill="#DDE8EE" />
                    <circle cx="52" cy="52" r="24" fill="#7ED7F7" />
                    <circle cx="72" cy="52" r="18" fill="#4FA7A7" />
                    <circle cx="82" cy="40" r="4" fill="#2D3436" />
                    <path d="M91 48L108 54L91 60V48Z" fill="#F7C7D4" />
                    <path d="M29 57C35 49 44 46 53 46" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
                    <path d="M44 74C53 80 67 80 77 73" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="absolute -right-6 top-4 rounded-2xl border border-[#3C4166]/10 bg-white px-4 py-3 shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B6F8E]">
                  Status
                </p>
                <p className="mt-1 text-sm font-bold text-[#3C4166]">In flight</p>
              </div>

              <div className="absolute -left-8 bottom-4 rounded-2xl border border-[#3C4166]/10 bg-white px-4 py-3 shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B6F8E]">
                  ETA
                </p>
                <p className="mt-1 text-sm font-bold text-[#3C4166]">Very soon</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button className="h-12 rounded-full bg-[#4FA7A7] px-8 text-white hover:bg-[#4FA7A7]/90">
                Create account
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                variant="outline"
                className="h-12 rounded-full border-[#3C4166]/20 px-8 text-[#3C4166] hover:bg-white/60"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}