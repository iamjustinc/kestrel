"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const email = searchParams.get("email") || "name@example.com"

  const canContinue = useMemo(() => {
    return password.trim().length > 0
  }, [password])

  const handleConfirm = () => {
    if (!canContinue) return
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#F6F1E7] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <div className="w-full max-w-[720px] rounded-[2.25rem] border-2 border-[#A8D0D0] bg-white/80 px-6 py-7 shadow-[0_20px_60px_rgba(60,65,102,0.06)] backdrop-blur-xl sm:px-8 sm:py-8">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-[#3C4166]/10 bg-white">
              <Mail className="h-8 w-8 text-[#2D3436]" />
            </div>
          </div>

          <div className="mb-8 text-center">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-[#2D3436] sm:text-xs">
              Welcome to Quail
            </p>
            <h1 className="text-4xl font-black tracking-tight text-[#2D3436] sm:text-5xl">
              Enter password
            </h1>
            <p className="mt-3 text-lg text-[#2D3436]/85 sm:text-xl">
              Signing in as {email}
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.22em] text-[#2D3436] sm:text-[13px]">
                Password
              </label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-16 rounded-[1.6rem] border-2 border-[#A8D0D0] bg-transparent px-6 pr-24 text-lg text-[#2D3436] placeholder:text-[#2D3436]/40 shadow-none focus-visible:ring-0 focus-visible:border-[#4FA7A7]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black uppercase tracking-[0.18em] text-[#7ED7F7]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!canContinue}
              className={`h-16 w-full rounded-[1.6rem] text-xl font-black transition-all ${
                canContinue
                  ? "bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7] text-white hover:opacity-95 shadow-md shadow-[#4FA7A7]/20"
                  : "bg-[#DDE8EE] text-white opacity-100"
              }`}
            >
              Confirm
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="h-16 w-full rounded-[1.6rem] border-2 border-[#A8D0D0] bg-transparent text-xl font-bold text-[#2D3436] hover:bg-[#3C4166]/5"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}