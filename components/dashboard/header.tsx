"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Menu, Plus, Search, CreditCard, LogOut, User, Settings } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getDemoUser, getDisplayName, getInitials, type DemoUser } from "@/lib/demo-auth"

export function DashboardHeader() {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)

  useEffect(() => {
    setDemoUser(getDemoUser())
  }, [])

  const displayName = getDisplayName(demoUser)
  const initials = getInitials(demoUser)
  const email = demoUser?.email ?? "alex@example.com"

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-[#3C4166]/10 bg-white/70 backdrop-blur-xl px-4 lg:px-8">
      {/* Mobile menu button */}
      <button className="lg:hidden p-2 text-[#6B6F8E] hover:text-[#3C4166] transition-colors">
        <Menu className="h-6 w-6" />
      </button>

      {/* Target role indicator (workspace label) */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9B6E4]/15 border border-[#C9B6E4]/20">
        <div className="h-2 w-2 rounded-full bg-[#E87BF1]" />
        <span className="text-xs font-medium text-[#3C4166]">Target: Product Manager</span>
      </div>

      {/* Search */}
      <div className="flex flex-1 gap-x-4 lg:gap-x-6 justify-end md:justify-start">
        <div className="relative flex flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6F8E]" />
          <input
            type="search"
            placeholder="Search analyses, skills, roles..."
            className="h-10 w-full rounded-full border border-[#3C4166]/10 bg-white/80 pl-10 pr-4 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/60 focus:border-[#4FA7A7] focus:outline-none focus:ring-2 focus:ring-[#4FA7A7]/20 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-x-3">
        <Link href="/dashboard/analysis">
          <Button className="hidden sm:flex bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7] hover:from-[#4FA7A7]/90 hover:to-[#7ED7F7]/90 text-white rounded-full px-4 h-9 text-sm shadow-md shadow-[#4FA7A7]/20 hover:shadow-lg hover:shadow-[#4FA7A7]/30 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </Link>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2.5 text-[#6B6F8E] hover:text-[#3C4166] hover:bg-[#3C4166]/5 rounded-full transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FF8FA3] ring-2 ring-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white/95 backdrop-blur-xl border-[#3C4166]/10">
            <DropdownMenuLabel className="text-[#3C4166]">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3C4166]/10" />
            <div className="p-4 text-center">
              <p className="text-sm text-[#6B6F8E]">No new notifications</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-1 rounded-full hover:bg-[#3C4166]/5 transition-colors">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#C9B6E4] to-[#F7C7D4] ring-2 ring-white shadow-md flex items-center justify-center">
                <span className="text-xs font-semibold text-white">{initials}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-xl border-[#3C4166]/10">
            <DropdownMenuLabel className="py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#C9B6E4] to-[#F7C7D4] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">{initials}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#3C4166]">{displayName}</span>
                  <span className="text-xs text-[#6B6F8E]">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3C4166]/10" />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/profile" className="flex items-center gap-3 text-[#3C4166]">
                <User className="h-4 w-4 text-[#6B6F8E]" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/settings" className="flex items-center gap-3 text-[#3C4166]">
                <Settings className="h-4 w-4 text-[#6B6F8E]" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/billing" className="flex items-center gap-3 text-[#3C4166]">
                <CreditCard className="h-4 w-4 text-[#6B6F8E]" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3C4166]/10" />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/sign-in" className="flex items-center gap-3 text-[#FF8FA3]">
                <LogOut className="h-4 w-4" />
                Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}