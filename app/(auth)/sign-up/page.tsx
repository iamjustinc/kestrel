"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Eye, EyeOff, User, CheckCircle2 } from "lucide-react"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F6F1E7] relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#F7C7D4]/30 to-[#C9B6E4]/20 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#4FA7A7]/15 to-[#7ED7F7]/20 blur-[80px]" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#E87BF1]/10 to-[#C9B6E4]/15 blur-[90px]" />
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[#3C4166] mb-2">Create your account</h1>
            <p className="text-[#6B6F8E]">Start your career intelligence journey</p>
          </div>

          {/* Social sign up */}
          <div className="space-y-3 mb-6">
            <Button 
              variant="outline" 
              className="w-full h-12 border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5 rounded-xl font-medium"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 border-[#3C4166]/15 text-[#3C4166] hover:bg-[#3C4166]/5 rounded-xl font-medium"
            >
              <svg className="h-5 w-5 mr-3" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#3C4166]/10" />
            <span className="text-sm text-[#6B6F8E]">or</span>
            <div className="flex-1 h-px bg-[#3C4166]/10" />
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[#3C4166]">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F8E]" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full h-12 rounded-xl border border-[#3C4166]/15 bg-white pl-11 pr-4 text-[#3C4166] placeholder:text-[#6B6F8E]/50 focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20 transition-all"
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#3C4166]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F8E]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full h-12 rounded-xl border border-[#3C4166]/15 bg-white pl-11 pr-12 text-[#3C4166] placeholder:text-[#6B6F8E]/50 focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6F8E] hover:text-[#3C4166] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 flex gap-1">
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 1 ? "bg-[#FF8FA3]" : "bg-[#3C4166]/10"}`} />
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 2 ? "bg-[#E87BF1]" : "bg-[#3C4166]/10"}`} />
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 3 ? "bg-[#4FA7A7]" : "bg-[#3C4166]/10"}`} />
                  </div>
                  <span className="text-xs text-[#6B6F8E]">
                    {passwordStrength === 1 ? "Weak" : passwordStrength === 2 ? "Good" : passwordStrength === 3 ? "Strong" : ""}
                  </span>
                </div>
              )}
            </div>

            <Link href="/dashboard">
              <Button 
                type="button"
                className="w-full h-12 bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-xl font-medium mt-6 transition-all hover:shadow-lg hover:shadow-[#4FA7A7]/20"
              >
                Create account
              </Button>
            </Link>
          </form>

          {/* Benefits */}
          <div className="mt-6 p-4 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5">
            <div className="flex items-center gap-2 text-sm text-[#3C4166]">
              <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
              <span>Free to start, no credit card required</span>
            </div>
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-[#6B6F8E] mt-6">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#4FA7A7] font-medium hover:text-[#4FA7A7]/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#6B6F8E] mt-6">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-[#4FA7A7] hover:underline">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-[#4FA7A7] hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
