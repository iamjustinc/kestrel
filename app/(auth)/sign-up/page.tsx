"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveDemoUser } from "@/lib/demo-auth"

export default function SignUpPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")

  const canContinue =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0

  const handleContinue = () => {
    if (!canContinue) return

    saveDemoUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    })

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F6F1E7] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#C9B6E4]/30 to-[#F7C7D4]/20 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#7ED7F7]/20 to-[#4FA7A7]/10 blur-[80px]" />
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#E87BF1]/10 to-[#C9B6E4]/15 blur-[90px]" />
      </div>

      <div className="relative w-full max-w-3xl">
        <div className="rounded-[2.5rem] border-2 border-[#A8D0D0] bg-white/80 backdrop-blur-xl p-8 sm:p-12 shadow-xl shadow-[#3C4166]/5">
          <div className="flex justify-center mb-8">
            <div className="h-20 w-20 rounded-2xl border border-[#3C4166]/10 bg-white flex items-center justify-center">
              <Mail className="h-10 w-10 text-[#2D3436]" />
            </div>
          </div>

          <div className="text-center mb-10">
            <p className="text-[12px] sm:text-sm font-black uppercase tracking-[0.35em] text-[#2D3436] mb-4">
              Welcome to Quail
            </p>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-[#2D3436]">
              Create account
            </h1>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] sm:text-sm font-black uppercase tracking-[0.25em] text-[#2D3436] mb-3">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Example"
                  className="h-20 rounded-[1.75rem] border-2 border-[#A8D0D0] bg-transparent px-8 text-2xl text-[#2D3436] placeholder:text-[#2D3436]/40 shadow-none focus-visible:ring-0 focus-visible:border-[#4FA7A7]"
                />
              </div>

              <div>
                <label className="block text-[13px] sm:text-sm font-black uppercase tracking-[0.25em] text-[#2D3436] mb-3">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Example"
                  className="h-20 rounded-[1.75rem] border-2 border-[#A8D0D0] bg-transparent px-8 text-2xl text-[#2D3436] placeholder:text-[#2D3436]/40 shadow-none focus-visible:ring-0 focus-visible:border-[#4FA7A7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] sm:text-sm font-black uppercase tracking-[0.25em] text-[#2D3436] mb-3">
                Email Address
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-20 rounded-[1.75rem] border-2 border-[#A8D0D0] bg-transparent px-8 text-2xl text-[#2D3436] placeholder:text-[#2D3436]/40 shadow-none focus-visible:ring-0 focus-visible:border-[#4FA7A7]"
              />
            </div>

            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              className="h-24 w-full rounded-[1.75rem] bg-[#DDE8EE] text-white text-2xl font-black hover:bg-[#4FA7A7] disabled:opacity-100 disabled:bg-[#DDE8EE] disabled:text-white"
            >
              Confirm
            </Button>

            <p className="text-center text-[#6B6F8E]">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-[#4FA7A7] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}