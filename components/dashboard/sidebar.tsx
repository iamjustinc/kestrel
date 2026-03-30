"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FileSearch, 
  Map, 
  Bookmark, 
  Settings, 
  FileText,
  User,
  Sparkles
} from "lucide-react"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Analysis", href: "/dashboard/analysis", icon: Sparkles },
  { name: "Saved Analyses", href: "/dashboard/saved", icon: Bookmark },
  { name: "Resume Lab", href: "/dashboard/resume", icon: FileText },
  { name: "Roadmap", href: "/dashboard/roadmap", icon: Map },
]

const secondaryNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/60 backdrop-blur-xl border-r border-[#3C4166]/10 px-6 pb-4 relative">
          {/* Subtle gradient edge */}
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-[#C9B6E4]/20 via-[#F7C7D4]/20 to-[#7ED7F7]/20" />
          
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7] flex items-center justify-center shadow-md shadow-[#4FA7A7]/20 group-hover:shadow-lg group-hover:shadow-[#4FA7A7]/30 transition-all">
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
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-xl p-3 text-sm font-medium leading-6 transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r from-[#4FA7A7]/15 to-[#7ED7F7]/10 text-[#4FA7A7] shadow-sm"
                              : "text-[#6B6F8E] hover:text-[#3C4166] hover:bg-[#3C4166]/5"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0 transition-colors",
                              isActive ? "text-[#4FA7A7]" : "text-[#6B6F8E] group-hover:text-[#3C4166]"
                            )}
                          />
                          {item.name}
                          {item.name === "New Analysis" && (
                            <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-[#E87BF1]/15 text-[#E87BF1]">
                              AI
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>

              {/* Secondary nav */}
              <li className="mt-auto">
                <div className="mb-2 px-3 text-xs font-medium text-[#6B6F8E]/70 uppercase tracking-wider">
                  Account
                </div>
                <ul role="list" className="-mx-2 space-y-1">
                  {secondaryNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-xl p-3 text-sm font-medium leading-6 transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r from-[#4FA7A7]/15 to-[#7ED7F7]/10 text-[#4FA7A7]"
                              : "text-[#6B6F8E] hover:text-[#3C4166] hover:bg-[#3C4166]/5"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0 transition-colors",
                              isActive ? "text-[#4FA7A7]" : "text-[#6B6F8E] group-hover:text-[#3C4166]"
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#3C4166]/10 px-2 py-2 safe-area-bottom">
        <nav className="flex justify-around">
          {[...navigation.slice(0, 4), secondaryNavigation[1]].map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[4rem]",
                  isActive 
                    ? "text-[#4FA7A7] bg-[#4FA7A7]/10" 
                    : "text-[#6B6F8E]"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.name.split(" ")[0]}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
