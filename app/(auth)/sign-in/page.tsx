"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveDemoUser } from "@/lib/demo-auth"

export default function SignInPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [rememberMe, setRememberMe] = useState(true)

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
              Sign in as:
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

            <label className="flex items-center gap-4 text-[#2D3436] text-xl font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-7 w-7 rounded border-2 border-[#A8D0D0] accent-[#7ED7F7]"
              />
              Remember me
            </label>

            <div className="text-center pt-2">
              <p className="text-[13px] sm:text-sm font-black uppercase tracking-[0.35em] text-[#2D3436]">
                Or log in with
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-24 rounded-[1.75rem] border-2 border-[#A8D0D0] bg-transparent text-[#2D3436] text-xl font-semibold hover:bg-[#3C4166]/5"
              >
                <svg className="h-8 w-8 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-24 rounded-[1.75rem] border-2 border-[#A8D0D0] bg-transparent text-[#2D3436] text-xl font-semibold hover:bg-[#3C4166]/5"
              >
                <Mail className="h-8 w-8 mr-3" />
                Continue with Outlook
              </Button>
            </div>

            <p className="text-center text-[#6B6F8E]">
              Need an account?{" "}
              <Link href="/sign-up" className="text-[#4FA7A7] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}