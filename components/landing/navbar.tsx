"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F6F1E7]/80 backdrop-blur-md border-b border-[#3C4166]/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7] flex items-center justify-center">
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
            <span className="text-xl font-semibold text-[#3C4166] tracking-tight">Kestrel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#product" className="text-sm text-[#6B6F8E] hover:text-[#3C4166] transition-colors">
              Product
            </Link>
            <Link href="#how-it-works" className="text-sm text-[#6B6F8E] hover:text-[#3C4166] transition-colors">
              How it Works
            </Link>
            <Link href="#roadmap" className="text-sm text-[#6B6F8E] hover:text-[#3C4166] transition-colors">
              Roadmap
            </Link>
            <Link href="#resources" className="text-sm text-[#6B6F8E] hover:text-[#3C4166] transition-colors">
              Resources
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-[#6B6F8E] hover:text-[#3C4166] hover:bg-[#3C4166]/5">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#3C4166]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#3C4166]/5">
            <div className="flex flex-col gap-4">
              <Link href="#product" className="text-sm text-[#6B6F8E] hover:text-[#3C4166] transition-colors">
                Product
              </Link>
              <Link href="#how-it-works" className="text-sm text-[#6B6F8E] hover:text-[#3C4166] transition-colors">
                How it Works
              </Link>
              <Link href="#roadmap" className="text-sm text-[#6B6F8E] hover:text-[#3C4166] transition-colors">
                Roadmap
              </Link>
              <Link href="#resources" className="text-sm text-[#6B6F8E] hover:text-[#3C4166] transition-colors">
                Resources
              </Link>
              <hr className="border-[#3C4166]/10" />
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start text-[#6B6F8E]">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="w-full bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-full">
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
