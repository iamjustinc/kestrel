"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowUpDown,
  Calendar,
  Building2,
  Target,
  Trash2,
  MoreHorizontal,
  CheckSquare,
  Square,
  GitCompare,
  ExternalLink,
  Star,
  Clock
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Mock saved analyses data
const savedAnalyses = [
  {
    id: 1,
    role: "Product Manager",
    company: "Stripe",
    readinessScore: 78,
    atsScore: 85,
    createdAt: "2 hours ago",
    tags: ["PM", "Fintech", "B2B"],
    favorite: true,
    status: "strong-match"
  },
  {
    id: 2,
    role: "Solutions Engineer",
    company: "Figma",
    readinessScore: 82,
    atsScore: 91,
    createdAt: "Yesterday",
    tags: ["SE", "Design Tools", "SaaS"],
    favorite: false,
    status: "strong-match"
  },
  {
    id: 3,
    role: "Technical PM",
    company: "Notion",
    readinessScore: 71,
    atsScore: 78,
    createdAt: "3 days ago",
    tags: ["PM", "Productivity", "B2B"],
    favorite: true,
    status: "good-match"
  },
  {
    id: 4,
    role: "Product Manager",
    company: "Linear",
    readinessScore: 85,
    atsScore: 88,
    createdAt: "1 week ago",
    tags: ["PM", "Developer Tools", "Startup"],
    favorite: false,
    status: "strong-match"
  },
  {
    id: 5,
    role: "Growth PM",
    company: "Airbnb",
    readinessScore: 65,
    atsScore: 72,
    createdAt: "2 weeks ago",
    tags: ["PM", "Growth", "Marketplace"],
    favorite: false,
    status: "needs-work"
  },
  {
    id: 6,
    role: "Senior PM",
    company: "Slack",
    readinessScore: 58,
    atsScore: 65,
    createdAt: "3 weeks ago",
    tags: ["PM", "Enterprise", "Communication"],
    favorite: false,
    status: "needs-work"
  },
]

const roleTypes = ["All", "PM", "SE", "Growth", "Technical"]
const sortOptions = ["Recent", "Score: High to Low", "Score: Low to High", "Company A-Z"]

export default function SavedAnalysesPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoleType, setSelectedRoleType] = useState("All")
  const [sortBy, setSortBy] = useState("Recent")
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([])

  const filteredAnalyses = savedAnalyses
    .filter(a => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return a.role.toLowerCase().includes(query) || 
               a.company.toLowerCase().includes(query) ||
               a.tags.some(t => t.toLowerCase().includes(query))
      }
      return true
    })
    .filter(a => {
      if (selectedRoleType === "All") return true
      return a.tags.includes(selectedRoleType)
    })

  const toggleCompareSelection = (id: number) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(prev => prev.filter(i => i !== id))
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare(prev => [...prev, id])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "strong-match":
        return "from-[#4FA7A7] to-[#7ED7F7]"
      case "good-match":
        return "from-[#E87BF1] to-[#C9B6E4]"
      case "needs-work":
        return "from-[#FF8FA3] to-[#F7C7D4]"
      default:
        return "from-[#3C4166]/20 to-[#3C4166]/10"
    }
  }

  return (
    <div className="pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166]">
            Saved Analyses
          </h1>
          <p className="mt-1 text-[#6B6F8E]">
            {savedAnalyses.length} analyses saved
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant={compareMode ? "default" : "outline"}
            onClick={() => {
              setCompareMode(!compareMode)
              setSelectedForCompare([])
            }}
            className={cn(
              compareMode 
                ? "bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white"
                : "border-[#3C4166]/15 text-[#3C4166]"
            )}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            {compareMode ? "Exit Compare" : "Compare"}
          </Button>
          <Link href="/dashboard/analysis">
            <Button className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white">
              New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Compare Mode Banner */}
      {compareMode && (
        <Card className="mb-6 bg-gradient-to-r from-[#4FA7A7]/10 to-[#7ED7F7]/10 border-[#4FA7A7]/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitCompare className="h-5 w-5 text-[#4FA7A7]" />
                <span className="text-sm text-[#3C4166]">
                  Select up to 3 analyses to compare. <strong>{selectedForCompare.length}/3</strong> selected.
                </span>
              </div>
              {selectedForCompare.length >= 2 && (
                <Button size="sm" className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white">
                  Compare Selected
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F8E]" />
          <input
            type="text"
            placeholder="Search by role, company, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#3C4166]/10 bg-white/50 text-sm text-[#3C4166] placeholder:text-[#6B6F8E]/50 focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
          />
        </div>

        {/* Role Type Filter */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/50 border border-[#3C4166]/10">
          {roleTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedRoleType(type)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                selectedRoleType === type
                  ? "bg-[#4FA7A7] text-white"
                  : "text-[#6B6F8E] hover:text-[#3C4166]"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-[#3C4166]/15 text-[#6B6F8E]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortBy}
          </Button>
          
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white/50 border border-[#3C4166]/10">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-2 rounded-lg transition-all",
                view === "grid" ? "bg-[#4FA7A7] text-white" : "text-[#6B6F8E]"
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-2 rounded-lg transition-all",
                view === "list" ? "bg-[#4FA7A7] text-white" : "text-[#6B6F8E]"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Analyses Grid/List */}
      {filteredAnalyses.length === 0 ? (
        <EmptyState searchQuery={searchQuery} />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnalyses.map((analysis) => (
            <AnalysisCard 
              key={analysis.id} 
              analysis={analysis}
              compareMode={compareMode}
              isSelected={selectedForCompare.includes(analysis.id)}
              onSelect={() => toggleCompareSelection(analysis.id)}
              statusColor={getStatusColor(analysis.status)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnalyses.map((analysis) => (
            <AnalysisRow 
              key={analysis.id} 
              analysis={analysis}
              compareMode={compareMode}
              isSelected={selectedForCompare.includes(analysis.id)}
              onSelect={() => toggleCompareSelection(analysis.id)}
              statusColor={getStatusColor(analysis.status)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AnalysisCard({ 
  analysis, 
  compareMode, 
  isSelected, 
  onSelect,
  statusColor 
}: { 
  analysis: typeof savedAnalyses[0]
  compareMode: boolean
  isSelected: boolean
  onSelect: () => void
  statusColor: string
}) {
  return (
    <Card className={cn(
      "bg-white/70 backdrop-blur-sm border-[#3C4166]/10 transition-all hover:shadow-md group",
      isSelected && "ring-2 ring-[#4FA7A7]"
    )}>
      <CardContent className="pt-5">
        {/* Header with score */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {compareMode ? (
              <button onClick={onSelect} className="flex-shrink-0">
                {isSelected ? (
                  <CheckSquare className="h-5 w-5 text-[#4FA7A7]" />
                ) : (
                  <Square className="h-5 w-5 text-[#6B6F8E]" />
                )}
              </button>
            ) : (
              <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center", statusColor)}>
                <span className="text-sm font-bold text-white">{analysis.readinessScore}</span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-[#3C4166]">{analysis.role}</h3>
              <div className="flex items-center gap-1 text-sm text-[#6B6F8E]">
                <Building2 className="h-3.5 w-3.5" />
                {analysis.company}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {analysis.favorite && (
              <Star className="h-4 w-4 text-[#E87BF1] fill-[#E87BF1]" />
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B6F8E] opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-[#F6F1E7]/50">
            <p className="text-xs text-[#6B6F8E] mb-1">Readiness</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-[#3C4166]/10 overflow-hidden">
                <div 
                  className={cn("h-full rounded-full bg-gradient-to-r", statusColor)}
                  style={{ width: `${analysis.readinessScore}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[#3C4166]">{analysis.readinessScore}%</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#F6F1E7]/50">
            <p className="text-xs text-[#6B6F8E] mb-1">ATS Score</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-[#3C4166]/10 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#7ED7F7] to-[#4FA7A7]"
                  style={{ width: `${analysis.atsScore}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[#3C4166]">{analysis.atsScore}%</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {analysis.tags.map((tag) => (
            <span 
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-[#C9B6E4]/20 text-[#6B6F8E]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#3C4166]/10">
          <span className="text-xs text-[#6B6F8E] flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {analysis.createdAt}
          </span>
          <Link href="/dashboard/analysis/results">
            <Button variant="ghost" size="sm" className="text-[#4FA7A7] hover:text-[#4FA7A7] hover:bg-[#4FA7A7]/10 h-8">
              View Results
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function AnalysisRow({ 
  analysis, 
  compareMode, 
  isSelected, 
  onSelect,
  statusColor 
}: { 
  analysis: typeof savedAnalyses[0]
  compareMode: boolean
  isSelected: boolean
  onSelect: () => void
  statusColor: string
}) {
  return (
    <Card className={cn(
      "bg-white/70 backdrop-blur-sm border-[#3C4166]/10 transition-all hover:shadow-md",
      isSelected && "ring-2 ring-[#4FA7A7]"
    )}>
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          {compareMode && (
            <button onClick={onSelect} className="flex-shrink-0">
              {isSelected ? (
                <CheckSquare className="h-5 w-5 text-[#4FA7A7]" />
              ) : (
                <Square className="h-5 w-5 text-[#6B6F8E]" />
              )}
            </button>
          )}
          
          <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0", statusColor)}>
            <span className="text-lg font-bold text-white">{analysis.readinessScore}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#3C4166]">{analysis.role}</h3>
              {analysis.favorite && (
                <Star className="h-4 w-4 text-[#E87BF1] fill-[#E87BF1]" />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-[#6B6F8E]">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {analysis.company}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {analysis.createdAt}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {analysis.tags.map((tag) => (
              <span 
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-[#C9B6E4]/20 text-[#6B6F8E]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <p className="text-xs text-[#6B6F8E]">ATS</p>
              <p className="text-sm font-semibold text-[#4FA7A7]">{analysis.atsScore}%</p>
            </div>
            <Link href="/dashboard/analysis/results">
              <Button variant="outline" size="sm" className="border-[#3C4166]/15 text-[#3C4166]">
                View
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B6F8E]">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
      <CardContent className="py-16 text-center">
        <div className="h-16 w-16 rounded-2xl bg-[#F6F1E7] flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-[#6B6F8E]" />
        </div>
        {searchQuery ? (
          <>
            <h3 className="text-lg font-semibold text-[#3C4166] mb-2">No results found</h3>
            <p className="text-[#6B6F8E] mb-6">
              No analyses match &quot;{searchQuery}&quot;. Try a different search.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-[#3C4166] mb-2">No saved analyses yet</h3>
            <p className="text-[#6B6F8E] mb-6">
              Start your first analysis to see how you match with your target roles.
            </p>
          </>
        )}
        <Link href="/dashboard/analysis">
          <Button className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white">
            Start New Analysis
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
