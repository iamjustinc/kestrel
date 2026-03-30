"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F6F1E7] relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#7ED7F7]/20 to-[#4FA7A7]/15 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#C9B6E4]/20 to-[#F7C7D4]/15 blur-[80px]" />
      </div>

      {/* Auth card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7] flex items-center justify-center shadow-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-white"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-semibold text-[#3C4166] tracking-tight">Kestrel</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#3C4166]/10 rounded-2xl p-8 shadow-xl shadow-[#3C4166]/5">
          {!submitted ? (
            <>
              {/* Back link */}
              <Link 
                href="/sign-in" 
                className="inline-flex items-center gap-2 text-sm text-[#6B6F8E] hover:text-[#3C4166] transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>

              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#3C4166] mb-2">Reset your password</h1>
                <p className="text-[#6B6F8E]">
                  Enter your email and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#3C4166]">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F8E]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-12 rounded-xl border border-[#3C4166]/15 bg-white pl-11 pr-4 text-[#3C4166] placeholder:text-[#6B6F8E]/50 focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-12 bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-xl font-medium mt-2 transition-all hover:shadow-lg hover:shadow-[#4FA7A7]/20"
                >
                  Send reset link
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#C8F5DF] flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-[#4FA7A7]" />
                </div>
                <h1 className="text-2xl font-semibold text-[#3C4166] mb-2">Check your email</h1>
                <p className="text-[#6B6F8E] mb-6">
                  We&apos;ve sent a password reset link to <span className="font-medium text-[#3C4166]">{email}</span>
                </p>
                <p className="text-sm text-[#6B6F8E] mb-6">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="text-[#4FA7A7] font-medium hover:text-[#4FA7A7]/80 transition-colors"
                  >
                    try again
                  </button>
                </p>
                <Link href="/sign-in">
                  <Button 
                    variant="outline"
                    className="w-full h-12 border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5 rounded-xl font-medium"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
