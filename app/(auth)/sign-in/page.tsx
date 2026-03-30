"use client"

import { useMemo, useState } from "react"
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

  const emailIsValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }, [email])

  const canContinue =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    emailIsValid

  const handleContinue = () => {
    if (!canContinue) return

    saveDemoUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    })

    router.push(`/sign-in/password?email=${encodeURIComponent(email.trim())}`)
  }

  return (
    <div className="min-h-screen bg-[#F6F1E7] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <div className="w-full max-w-[760px] rounded-[2.25rem] border-2 border-[#A8D0D0] bg-white/80 px-6 py-7 shadow-[0_20px_60px_rgba(60,65,102,0.06)] backdrop-blur-xl sm:px-8 sm:py-8">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-[#3C4166]/10 bg-white">
              <Mail className="h-8 w-8 text-[#2D3436]" />
            </div>
          </div>

          <div className="mb-7 text-center">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-[#2D3436] sm:text-xs">
              Welcome to Quail
            </p>
            <h1 className="text-4xl font-black tracking-tight text-[#2D3436] sm:text-5xl">
              Sign in as:
            </h1>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.22em] text-[#2D3436] sm:text-[13px]">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Example"
                  className="h-16 rounded-[1.6rem] border-2 border-[#A8D0D0] bg-transparent px-6 text-lg text-[#2D3436] placeholder:text-[#2D3436]/40 shadow-none focus-visible:ring-0 focus-visible:border-[#4FA7A7]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.22em] text-[#2D3436] sm:text-[13px]">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Example"
                  className="h-16 rounded-[1.6rem] border-2 border-[#A8D0D0] bg-transparent px-6 text-lg text-[#2D3436] placeholder:text-[#2D3436]/40 shadow-none focus-visible:ring-0 focus-visible:border-[#4FA7A7]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.22em] text-[#2D3436] sm:text-[13px]">
                Email Address
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`h-16 rounded-[1.6rem] border-2 bg-transparent px-6 text-lg text-[#2D3436] placeholder:text-[#2D3436]/40 shadow-none focus-visible:ring-0 ${
                  email.length === 0
                    ? "border-[#A8D0D0] focus-visible:border-[#4FA7A7]"
                    : emailIsValid
                    ? "border-[#7BC6AE] focus-visible:border-[#7BC6AE]"
                    : "border-[#E7B7BF] focus-visible:border-[#E7B7BF]"
                }`}
              />

              <div className="mt-2 min-h-[20px]">
                {email.length > 0 && emailIsValid && (
                  <p className="text-sm font-medium text-[#5E9E84]">
                    Valid email format detected
                  </p>
                )}

                {email.length > 0 && !emailIsValid && (
                  <p className="text-sm font-medium text-[#C47A87]">
                    Please enter a valid email like name@example.com
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`h-16 w-full rounded-[1.6rem] text-xl font-black transition-all ${
                canContinue
                  ? "bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7] text-white hover:opacity-95 shadow-md shadow-[#4FA7A7]/20"
                  : "bg-[#DDE8EE] text-white opacity-100"
              }`}
            >
              Confirm
            </Button>

            <label className="flex items-center gap-3 pt-1 text-lg font-medium text-[#2D3436]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-5 w-5 rounded border-2 border-[#A8D0D0] accent-[#7ED7F7]"
              />
              Remember me
            </label>

            <div className="pt-1 text-center">
              <p className="text-[12px] font-black uppercase tracking-[0.32em] text-[#2D3436] sm:text-[13px]">
                Or log in with
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="h-16 w-full rounded-[1.6rem] border-2 border-[#A8D0D0] bg-transparent text-lg font-semibold text-[#2D3436] hover:bg-[#3C4166]/5"
              >
                <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="h-16 w-full rounded-[1.6rem] border-2 border-[#A8D0D0] bg-transparent text-lg font-semibold text-[#2D3436] hover:bg-[#3C4166]/5"
              >
                <Mail className="mr-3 h-6 w-6" />
                Continue with Outlook
              </Button>
            </div>

            <p className="pt-1 text-center text-sm text-[#6B6F8E]">
              Need an account?{" "}
              <Link href="/sign-up" className="font-semibold text-[#4FA7A7] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}