"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight,
  Calendar,
  Target,
  BookOpen,
  Briefcase,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock roadmap data organized by Now/Soon/Later
const roadmapData = {
  now: [
    {
      id: 1,
      title: "Update Resume with Metrics",
      description: "Add quantified impact to your experience bullets - quick win with high impact.",
      category: "Quick Win",
      timeEstimate: "2 hours",
      status: "in-progress",
      progress: 60,
      skillTarget: "Resume Optimization",
      priority: "critical",
      subtasks: [
        { title: "Add metrics to TechStart bullets", done: true },
        { title: "Add metrics to DataCorp bullets", done: true },
        { title: "Review and refine language", done: false },
      ],
      resources: [
        { title: "Resume Lab", url: "/dashboard/resume-lab", internal: true },
      ]
    },
    {
      id: 2,
      title: "Add Missing ATS Keywords",
      description: "Incorporate SQL, data-driven, and experimentation terminology throughout resume.",
      category: "Quick Win",
      timeEstimate: "1 hour",
      status: "todo",
      progress: 0,
      skillTarget: "ATS Optimization",
      priority: "high",
      subtasks: [
        { title: "Add SQL to skills section", done: false },
        { title: "Incorporate 'data-driven' in experience", done: false },
        { title: "Add experimentation keywords", done: false },
      ],
      resources: [
        { title: "ATS Keywords Guide", url: "#" },
      ]
    },
  ],
  soon: [
    {
      id: 3,
      title: "Complete SQL Fundamentals Course",
      description: "Master basic SQL queries, joins, aggregations - critical skill gap for PM roles.",
      category: "Learning",
      timeEstimate: "2 weeks",
      status: "todo",
      progress: 0,
      skillTarget: "SQL & Data Analysis",
      priority: "critical",
      subtasks: [
        { title: "Basic SELECT queries", done: false },
        { title: "JOINs and relationships", done: false },
        { title: "Aggregations (GROUP BY, HAVING)", done: false },
        { title: "Subqueries and CTEs", done: false },
        { title: "Window functions", done: false },
      ],
      resources: [
        { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial" },
        { title: "SQLZoo Practice", url: "https://sqlzoo.net" },
      ]
    },
    {
      id: 4,
      title: "Write 2 PRDs for Portfolio",
      description: "Document your product thinking with professional PRDs that showcase technical documentation skills.",
      category: "Documentation",
      timeEstimate: "1 week",
      status: "todo",
      progress: 0,
      skillTarget: "Technical Documentation",
      priority: "high",
      subtasks: [
        { title: "Select 2 past projects to document", done: false },
        { title: "Write PRD for project 1", done: false },
        { title: "Write PRD for project 2", done: false },
        { title: "Add to portfolio site", done: false },
      ],
      resources: [
        { title: "PRD Template", url: "#" },
        { title: "Example PRDs", url: "#" },
      ]
    },
    {
      id: 5,
      title: "Get Amplitude Certification",
      description: "Free certification that validates analytics skills - highly relevant for PM roles.",
      category: "Certification",
      timeEstimate: "3-5 hours",
      status: "todo",
      progress: 0,
      skillTarget: "Product Analytics",
      priority: "medium",
      subtasks: [
        { title: "Complete Amplitude Academy courses", done: false },
        { title: "Pass certification exam", done: false },
        { title: "Add to LinkedIn and resume", done: false },
      ],
      resources: [
        { title: "Amplitude Academy", url: "https://academy.amplitude.com" },
      ]
    },
  ],
  later: [
    {
      id: 6,
      title: "Build SQL Portfolio Project",
      description: "Create an analytics dashboard project demonstrating SQL proficiency and data storytelling.",
      category: "Project",
      timeEstimate: "2 weeks",
      status: "todo",
      progress: 0,
      skillTarget: "SQL & Data Analysis",
      priority: "high",
      subtasks: [
        { title: "Choose dataset and define questions", done: false },
        { title: "Write SQL queries for insights", done: false },
        { title: "Build visualization dashboard", done: false },
        { title: "Write case study documentation", done: false },
        { title: "Add to portfolio", done: false },
      ],
      resources: [
        { title: "Public Datasets", url: "#" },
        { title: "Dashboard Tools Guide", url: "#" },
      ]
    },
    {
      id: 7,
      title: "Run A/B Test on Side Project",
      description: "Design, implement, and analyze an A/B test to demonstrate experimentation skills.",
      category: "Project",
      timeEstimate: "2-3 weeks",
      status: "todo",
      progress: 0,
      skillTarget: "Experimentation",
      priority: "high",
      subtasks: [
        { title: "Define hypothesis and success metrics", done: false },
        { title: "Set up test variants", done: false },
        { title: "Collect data over 1-2 weeks", done: false },
        { title: "Analyze results with statistical rigor", done: false },
        { title: "Document learnings and case study", done: false },
      ],
      resources: [
        { title: "A/B Testing Guide", url: "#" },
        { title: "Stats Calculator", url: "#" },
      ]
    },
    {
      id: 8,
      title: "Product School PM Certification",
      description: "Comprehensive PM certification for career advancement - consider after core skills addressed.",
      category: "Certification",
      timeEstimate: "8 weeks",
      status: "todo",
      progress: 0,
      skillTarget: "Product Management",
      priority: "low",
      subtasks: [
        { title: "Enroll in course", done: false },
        { title: "Complete modules", done: false },
        { title: "Final project", done: false },
        { title: "Certification exam", done: false },
      ],
      resources: [
        { title: "Product School", url: "https://productschool.com" },
      ]
    },
  ]
}

const categoryIcons: Record<string, typeof BookOpen> = {
  "Quick Win": Zap,
  Learning: BookOpen,
  Project: Briefcase,
  Documentation: Target,
  Certification: Award,
}

const categoryColors: Record<string, string> = {
  "Quick Win": "from-[#4FA7A7] to-[#7ED7F7]",
  Learning: "from-[#E87BF1] to-[#C9B6E4]",
  Project: "from-[#F7C7D4] to-[#FF8FA3]",
  Documentation: "from-[#7ED7F7] to-[#4FA7A7]",
  Certification: "from-[#C8F5DF] to-[#4FA7A7]",
}

export default function RoadmapPage() {
  const [expandedItems, setExpandedItems] = useState<number[]>([1, 3])
  const [completedTasks, setCompletedTasks] = useState<{[key: number]: number[]}>({
    1: [0, 1]
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSubtask = (itemId: number, subtaskIndex: number) => {
    setCompletedTasks(prev => {
      const current = prev[itemId] || []
      if (current.includes(subtaskIndex)) {
        return { ...prev, [itemId]: current.filter(i => i !== subtaskIndex) }
      }
      return { ...prev, [itemId]: [...current, subtaskIndex] }
    })
  }

  const allItems = [...roadmapData.now, ...roadmapData.soon, ...roadmapData.later]
  const totalProgress = Math.round(
    allItems.reduce((acc, item) => {
      const completed = (completedTasks[item.id] || []).length
      const total = item.subtasks.length
      return acc + (completed / total) * 100
    }, 0) / allItems.length
  )

  const estimatedWeeks = 6

  return (
    <div className="pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166]">
            Your Career Roadmap
          </h1>
          <p className="mt-1 text-[#6B6F8E]">
            Strategic plan to reach Product Manager at Stripe
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#3C4166]/15 text-[#3C4166]">
            <Calendar className="h-4 w-4 mr-2" />
            Add to Calendar
          </Button>
          <Button variant="outline" className="border-[#3C4166]/15 text-[#3C4166]">
            <RotateCcw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8 bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7] border-0 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <CardContent className="py-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Progress circle */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-28 h-28 -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="white"
                    strokeOpacity="0.2"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(totalProgress / 100) * 301} 301`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{totalProgress}%</span>
                  <span className="text-xs opacity-80">Complete</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Mission Progress</h3>
                <p className="text-white/80 text-sm">
                  {allItems.filter(i => (completedTasks[i.id] || []).length === i.subtasks.length).length} of {allItems.length} milestones complete
                </p>
              </div>
            </div>

            {/* Middle: Stats */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold">{roadmapData.now.length}</p>
                <p className="text-sm opacity-80">Do Now</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold">{roadmapData.soon.length}</p>
                <p className="text-sm opacity-80">Do Soon</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold">{roadmapData.later.length}</p>
                <p className="text-sm opacity-80">Do Later</p>
              </div>
            </div>

            {/* Right: Estimated time */}
            <div className="text-center lg:text-right">
              <p className="text-3xl font-bold">{estimatedWeeks} weeks</p>
              <p className="text-sm opacity-80">Estimated completion</p>
              <p className="text-xs opacity-60 mt-1">At 10 hrs/week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Sections */}
      <div className="space-y-8">
        {/* Now Section */}
        <RoadmapSection
          title="Do Now"
          subtitle="Quick wins you can complete this week"
          icon={<Zap className="h-5 w-5 text-white" />}
          iconBg="bg-[#4FA7A7]"
          items={roadmapData.now}
          expandedItems={expandedItems}
          completedTasks={completedTasks}
          onToggleExpanded={toggleExpanded}
          onToggleSubtask={toggleSubtask}
        />

        {/* Soon Section */}
        <RoadmapSection
          title="Do Soon"
          subtitle="High-priority items for the next 2-4 weeks"
          icon={<Clock className="h-5 w-5 text-white" />}
          iconBg="bg-[#E87BF1]"
          items={roadmapData.soon}
          expandedItems={expandedItems}
          completedTasks={completedTasks}
          onToggleExpanded={toggleExpanded}
          onToggleSubtask={toggleSubtask}
        />

        {/* Later Section */}
        <RoadmapSection
          title="Do Later"
          subtitle="Longer-term projects to solidify your expertise"
          icon={<Target className="h-5 w-5 text-white" />}
          iconBg="bg-[#7ED7F7]"
          items={roadmapData.later}
          expandedItems={expandedItems}
          completedTasks={completedTasks}
          onToggleExpanded={toggleExpanded}
          onToggleSubtask={toggleSubtask}
        />
      </div>
    </div>
  )
}

function RoadmapSection({
  title,
  subtitle,
  icon,
  iconBg,
  items,
  expandedItems,
  completedTasks,
  onToggleExpanded,
  onToggleSubtask,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  iconBg: string
  items: typeof roadmapData.now
  expandedItems: number[]
  completedTasks: {[key: number]: number[]}
  onToggleExpanded: (id: number) => void
  onToggleSubtask: (itemId: number, subtaskIndex: number) => void
}) {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", iconBg)}>
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#3C4166]">{title}</h2>
          <p className="text-sm text-[#6B6F8E]">{subtitle}</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4 ml-5 pl-8 border-l-2 border-[#3C4166]/10">
        {items.map((item) => {
          const Icon = categoryIcons[item.category] || Target
          const isExpanded = expandedItems.includes(item.id)
          const itemCompleted = completedTasks[item.id] || []
          const progress = Math.round((itemCompleted.length / item.subtasks.length) * 100)
          const isComplete = progress === 100

          return (
            <Card 
              key={item.id}
              className={cn(
                "bg-white/70 backdrop-blur-sm border-[#3C4166]/10 transition-all ml-4",
                isComplete && "opacity-60"
              )}
            >
              <CardContent className="pt-5">
                {/* Header */}
                <div className="flex items-start gap-4">
                  {/* Status dot */}
                  <div className="relative -ml-12 mt-1">
                    <div className={cn(
                      "h-4 w-4 rounded-full border-2 border-white shadow-sm",
                      isComplete 
                        ? "bg-[#4FA7A7]"
                        : progress > 0
                          ? "bg-[#E87BF1]"
                          : "bg-[#3C4166]/20"
                    )} />
                  </div>

                  {/* Icon */}
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br flex-shrink-0",
                    categoryColors[item.category]
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#3C4166]/10 text-[#6B6F8E]">
                            {item.category}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            item.priority === "critical"
                              ? "bg-[#FF8FA3]/20 text-[#FF8FA3]"
                              : item.priority === "high"
                                ? "bg-[#E87BF1]/20 text-[#E87BF1]"
                                : "bg-[#7ED7F7]/20 text-[#4FA7A7]"
                          )}>
                            {item.priority} priority
                          </span>
                          {isComplete && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#C8F5DF] text-[#4FA7A7]">
                              Complete
                            </span>
                          )}
                        </div>
                        <h3 className={cn(
                          "text-lg font-semibold text-[#3C4166] mb-1",
                          isComplete && "line-through"
                        )}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#6B6F8E] mb-3">
                          {item.description}
                        </p>
                        
                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-1.5 text-[#6B6F8E]">
                            <Clock className="h-4 w-4" />
                            {item.timeEstimate}
                          </span>
                          <span className="flex items-center gap-1.5 text-[#6B6F8E]">
                            <Target className="h-4 w-4" />
                            {item.skillTarget}
                          </span>
                          <span className="flex items-center gap-1.5 text-[#4FA7A7]">
                            <CheckCircle2 className="h-4 w-4" />
                            {itemCompleted.length}/{item.subtasks.length} tasks
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all bg-gradient-to-r",
                                isComplete 
                                  ? "from-[#4FA7A7] to-[#7ED7F7]"
                                  : "from-[#E87BF1] to-[#C9B6E4]"
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expand button */}
                      <button
                        onClick={() => onToggleExpanded(item.id)}
                        className="p-2 text-[#6B6F8E] hover:text-[#3C4166] transition-colors flex-shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-[#3C4166]/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Subtasks */}
                          <div>
                            <h4 className="text-sm font-medium text-[#3C4166] mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-[#4FA7A7]" />
                              Tasks
                            </h4>
                            <div className="space-y-2">
                              {item.subtasks.map((subtask, i) => {
                                const isDone = itemCompleted.includes(i)
                                return (
                                  <button
                                    key={i}
                                    onClick={() => onToggleSubtask(item.id, i)}
                                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#F6F1E7]/50 transition-colors text-left"
                                  >
                                    {isDone ? (
                                      <CheckCircle2 className="h-4 w-4 text-[#4FA7A7] flex-shrink-0" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-[#6B6F8E] flex-shrink-0" />
                                    )}
                                    <span className={cn(
                                      "text-sm",
                                      isDone ? "text-[#6B6F8E] line-through" : "text-[#3C4166]"
                                    )}>
                                      {subtask.title}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Resources */}
                          <div>
                            <h4 className="text-sm font-medium text-[#3C4166] mb-3 flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-[#E87BF1]" />
                              Resources
                            </h4>
                            <div className="space-y-2">
                              {item.resources.map((resource, i) => (
                                <a 
                                  key={i}
                                  href={resource.url}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-[#F6F1E7]/50 text-sm text-[#4FA7A7] hover:bg-[#4FA7A7]/10 transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  {resource.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-6 flex items-center gap-3">
                          {!isComplete && (
                            <Button className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-full">
                              <Play className="h-4 w-4 mr-2" />
                              {progress > 0 ? "Continue" : "Start"}
                            </Button>
                          )}
                          {isComplete && (
                            <Button variant="outline" className="border-[#4FA7A7] text-[#4FA7A7]">
                              <Star className="h-4 w-4 mr-2" />
                              Mark as Favorite
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
