"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveDemoUser } from "@/lib/demo-auth"

const ROLE_OPTIONS = [
  "Solutions Engineer",
  "Product Manager",
  "Technical Program Manager",
  "Customer Success Manager",
  "Sales Engineer",
  "Product Marketing Manager",
  "Business Analyst",
  "Data Analyst",
]

const stepVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export default function SignUpPage() {
  const router = useRouter()

  const [step, setStep] = useState<1 | 2>(1)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const emailIsValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }, [email])

  const stepOneValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    emailIsValid &&
    password.trim().length >= 6

  const canFinish = stepOneValid && selectedRoles.length > 0

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((item) => item !== role) : [...prev, role]
    )
  }

  const handleNext = () => {
    if (!stepOneValid) return
    setStep(2)
  }

  const handleCreateAccount = () => {
    if (!canFinish) return

    const account = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      interestRoles: selectedRoles,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("kestrel_account", JSON.stringify(account))
    localStorage.setItem(
      "kestrel_session",
      JSON.stringify({
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        interestRoles: account.interestRoles,
      })
    )

    saveDemoUser({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
    })

    router.push("/dashboard")
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F1E7] px-4 py-6 sm:px-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[#C9B6E4]/25 to-[#F7C7D4]/15 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[320px] w-[320px] rounded-full bg-gradient-to-br from-[#7ED7F7]/15 to-[#4FA7A7]/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-[1.75rem] border-2 border-[#A8D0D0] bg-white/82 p-5 shadow-lg backdrop-blur-xl sm:p-6">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#3C4166]/10 bg-white">
              <Mail className="h-6 w-6 text-[#2D3436]" />
            </div>
          </div>

          <div className="mb-6 text-center">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#2D3436]">
              Welcome to Kestrel
            </p>

            <h1 className="text-2xl font-black tracking-tight text-[#2D3436] sm:text-3xl">
              {step === 1 ? "Create account" : "Set up your profile"}
            </h1>

            <p className="mt-2 text-sm text-[#6B6F8E]">
              {step === 1
                ? "Start with your basics so Kestrel can save your profile."
                : "Pick the roles you want Kestrel to tailor your roadmap toward."}
            </p>
          </div>

          <div className="mb-6 flex items-center justify-center gap-2">
            <div
              className={`h-1.5 w-16 rounded-full ${
                step === 1 ? "bg-[#4FA7A7]" : "bg-[#4FA7A7]/35"
              }`}
            />
            <div
              className={`h-1.5 w-16 rounded-full ${
                step === 2 ? "bg-[#4FA7A7]" : "bg-[#4FA7A7]/18"
              }`}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-[#2D3436]">
                      First Name
                    </label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Justin"
                      className="h-12 rounded-xl border-2 border-[#A8D0D0] px-4 text-sm text-[#2D3436] placeholder:text-[#2D3436]/35 focus-visible:border-[#4FA7A7] focus-visible:ring-0"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-[#2D3436]">
                      Last Name
                    </label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Chang"
                      className="h-12 rounded-xl border-2 border-[#A8D0D0] px-4 text-sm text-[#2D3436] placeholder:text-[#2D3436]/35 focus-visible:border-[#4FA7A7] focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-[#2D3436]">
                    Email Address
                  </label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`h-12 rounded-xl border-2 px-4 text-sm text-[#2D3436] placeholder:text-[#2D3436]/35 focus-visible:ring-0 ${
                      email.length === 0
                        ? "border-[#A8D0D0] focus-visible:border-[#4FA7A7]"
                        : emailIsValid
                        ? "border-[#7BC6AE] focus-visible:border-[#7BC6AE]"
                        : "border-[#E7B7BF] focus-visible:border-[#E7B7BF]"
                    }`}
                  />
                  <div className="mt-2 min-h-[20px]">
                    {email.length > 0 && emailIsValid && (
                      <p className="text-xs font-medium text-[#5E9E84]">
                        Valid email format detected
                      </p>
                    )}
                    {email.length > 0 && !emailIsValid && (
                      <p className="text-xs font-medium text-[#C47A87]">
                        Please enter a valid email like name@example.com
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-[#2D3436]">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="h-12 rounded-xl border-2 border-[#A8D0D0] px-4 text-sm text-[#2D3436] placeholder:text-[#2D3436]/35 focus-visible:border-[#4FA7A7] focus-visible:ring-0"
                  />
                  <p className="mt-2 text-xs text-[#6B6F8E]">
                    Use any password for now. This is a local demo flow.
                  </p>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!stepOneValid}
                  className="h-12 w-full rounded-xl bg-[#DDE8EE] text-sm font-bold text-white hover:bg-[#4FA7A7] disabled:opacity-100 disabled:bg-[#DDE8EE] disabled:text-white"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-center text-sm text-[#6B6F8E]">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="font-semibold text-[#4FA7A7] hover:underline">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.22em] text-[#2D3436]">
                    Interest Roles
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {ROLE_OPTIONS.map((role) => {
                      const selected = selectedRoles.includes(role)

                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => toggleRole(role)}
                          className={`flex min-h-[56px] items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                            selected
                              ? "border-[#4FA7A7] bg-[#EAF8F8]"
                              : "border-[#A8D0D0] bg-white hover:border-[#4FA7A7]/60"
                          }`}
                        >
                          <span className="font-medium text-[#2D3436]">{role}</span>
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full ${
                              selected ? "bg-[#4FA7A7] text-white" : "bg-[#EEF4F6] text-transparent"
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <p className="mt-3 text-xs text-[#6B6F8E]">
                    Pick one or more. These can be reflected later in profile-based experiences.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="h-12 rounded-xl border-2 border-[#A8D0D0] bg-transparent text-sm font-bold text-[#2D3436] hover:bg-[#3C4166]/5"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    onClick={handleCreateAccount}
                    disabled={!canFinish}
                    className="h-12 rounded-xl bg-[#DDE8EE] text-sm font-bold text-white hover:bg-[#4FA7A7] disabled:opacity-100 disabled:bg-[#DDE8EE] disabled:text-white"
                  >
                    Create account
                  </Button>
                </div>

                <p className="text-center text-sm text-[#6B6F8E]">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="font-semibold text-[#4FA7A7] hover:underline">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}