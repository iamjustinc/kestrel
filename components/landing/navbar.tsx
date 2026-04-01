"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#3C4166]/5 bg-[#F6F1E7]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-white"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#3C4166]">Kestrel</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#product" className="text-sm text-[#6B6F8E] transition-colors hover:text-[#3C4166]">
              Product
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-[#6B6F8E] transition-colors hover:text-[#3C4166]"
            >
              How it Works
            </Link>
            <Link
              href="/resources"
              className="text-sm text-[#6B6F8E] transition-colors hover:text-[#3C4166]"
            >
              Resources
            </Link>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-[#6B6F8E] hover:bg-[#3C4166]/5 hover:text-[#3C4166]">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-full bg-[#4FA7A7] px-6 text-white hover:bg-[#4FA7A7]/90">
                Get Started
              </Button>
            </Link>
          </div>

          <button className="p-2 text-[#3C4166] md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#3C4166]/5 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                href="/#product"
                onClick={closeMenu}
                className="text-sm text-[#6B6F8E] transition-colors hover:text-[#3C4166]"
              >
                Product
              </Link>
              <Link
                href="/#how-it-works"
                onClick={closeMenu}
                className="text-sm text-[#6B6F8E] transition-colors hover:text-[#3C4166]"
              >
                How it Works
              </Link>
              <Link
                href="/resources"
                onClick={closeMenu}
                className="text-sm text-[#6B6F8E] transition-colors hover:text-[#3C4166]"
              >
                Resources
              </Link>

              <hr className="border-[#3C4166]/10" />

              <Link href="/sign-in" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start text-[#6B6F8E]">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" onClick={closeMenu}>
                <Button className="w-full rounded-full bg-[#4FA7A7] text-white hover:bg-[#4FA7A7]/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}