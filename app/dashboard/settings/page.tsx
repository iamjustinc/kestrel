"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Upload,
  Save,
  Trash2,
  ExternalLink,
  Link2,
  Download,
  AlertTriangle,
  Check,
  Moon,
  Sun,
  Monitor,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getDemoUser, getInitials, saveDemoUser, type DemoUser } from "@/lib/demo-auth"

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "connected", label: "Connected", icon: Link2 },
  { id: "billing", label: "Billing", icon: CreditCard },
] as const

const EDITABLE_PROFILE_KEY = "kestrel_editable_profile"
const SAVED_PROFILE_KEY = "kestrel_saved_profile"
const SAVED_ANALYSES_KEY = "kestrel_saved_analyses"
const SETTINGS_STORAGE_KEY = "kestrel_settings"

type EditableProfile = {
  headline: string
  location: string
  linkedin: string
  preferredIndustries: string[]
}

type AppSettings = {
  notifications: {
    analysisComplete: boolean
    weeklyProgress: boolean
    milestoneReminders: boolean
    newFeatures: boolean
    tipsResources: boolean
    pushAnalysisReady: boolean
    pushRoadmapUpdates: boolean
  }
  privacy: {
    analytics: boolean
    profileVisibility: boolean
    resumeSharing: boolean
    aiTraining: boolean
  }
  appearance: {
    theme: "light" | "dark" | "system"
    compactMode: boolean
    animations: boolean
  }
  connected: {
    linkedin: boolean
    googleDrive: boolean
    github: boolean
    notion: boolean
  }
  billing: {
    plan: "free"
    autoRenew: boolean
  }
}

const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    analysisComplete: true,
    weeklyProgress: true,
    milestoneReminders: true,
    newFeatures: false,
    tipsResources: true,
    pushAnalysisReady: true,
    pushRoadmapUpdates: false,
  },
  privacy: {
    analytics: true,
    profileVisibility: false,
    resumeSharing: false,
    aiTraining: true,
  },
  appearance: {
    theme: "light",
    compactMode: false,
    animations: true,
  },
  connected: {
    linkedin: true,
    googleDrive: false,
    github: false,
    notion: false,
  },
  billing: {
    plan: "free",
    autoRenew: false,
  },
}

function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw)
    return {
      notifications: { ...DEFAULT_SETTINGS.notifications, ...(parsed.notifications || {}) },
      privacy: { ...DEFAULT_SETTINGS.privacy, ...(parsed.privacy || {}) },
      appearance: { ...DEFAULT_SETTINGS.appearance, ...(parsed.appearance || {}) },
      connected: { ...DEFAULT_SETTINGS.connected, ...(parsed.connected || {}) },
      billing: { ...DEFAULT_SETTINGS.billing, ...(parsed.billing || {}) },
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: AppSettings) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

function loadEditableProfile(): EditableProfile {
  if (typeof window === "undefined") {
    return {
      headline: "",
      location: "",
      linkedin: "",
      preferredIndustries: [],
    }
  }

  try {
    const raw = window.localStorage.getItem(EDITABLE_PROFILE_KEY)
    if (!raw) {
      return {
        headline: "",
        location: "",
        linkedin: "",
        preferredIndustries: [],
      }
    }

    const parsed = JSON.parse(raw)
    return {
      headline: typeof parsed?.headline === "string" ? parsed.headline : "",
      location: typeof parsed?.location === "string" ? parsed.location : "",
      linkedin: typeof parsed?.linkedin === "string" ? parsed.linkedin : "",
      preferredIndustries: Array.isArray(parsed?.preferredIndustries)
        ? parsed.preferredIndustries.filter((item: unknown) => typeof item === "string")
        : [],
    }
  } catch {
    return {
      headline: "",
      location: "",
      linkedin: "",
      preferredIndustries: [],
    }
  }
}

function saveEditableProfile(profile: EditableProfile) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(EDITABLE_PROFILE_KEY, JSON.stringify(profile))
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("account")
  const [mounted, setMounted] = useState(false)

  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)
  const [accountForm, setAccountForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    headline: "",
    location: "",
    linkedin: "",
  })

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [accountSaved, setAccountSaved] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")
  const [exportMessage, setExportMessage] = useState("")
  const [dangerMessage, setDangerMessage] = useState("")
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    setMounted(true)

    const user = getDemoUser()
    const editableProfile = loadEditableProfile()
    const loadedSettings = loadSettings()

    setDemoUser(user)
    setSettings(loadedSettings)
    setAccountForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      headline: editableProfile.headline ?? "",
      location: editableProfile.location ?? "",
      linkedin: editableProfile.linkedin ?? "",
    })
  }, [])

  useEffect(() => {
    if (!mounted) return
    saveSettings(settings)
  }, [settings, mounted])

  const initials = useMemo(() => getInitials(demoUser), [demoUser])

  const handleSaveAccount = () => {
    const cleanedUser: DemoUser = {
      firstName: accountForm.firstName.trim(),
      lastName: accountForm.lastName.trim(),
      email: accountForm.email.trim(),
    }

    saveDemoUser(cleanedUser)
    setDemoUser(cleanedUser)

    const existingEditable = loadEditableProfile()
    saveEditableProfile({
      ...existingEditable,
      headline: accountForm.headline.trim(),
      location: accountForm.location.trim(),
      linkedin: accountForm.linkedin.trim(),
    })

    setAccountSaved(true)
    setTimeout(() => setAccountSaved(false), 1800)
  }

  const handlePasswordUpdate = () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage("Add a new password and confirm it.")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.")
      return
    }

    setPasswordMessage("Password updated for this demo flow.")
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleExportAllData = () => {
    const payload = {
      user: getDemoUser(),
      editableProfile: loadEditableProfile(),
      savedProfile:
        typeof window !== "undefined"
          ? JSON.parse(window.localStorage.getItem(SAVED_PROFILE_KEY) || "null")
          : null,
      savedAnalyses:
        typeof window !== "undefined"
          ? JSON.parse(window.localStorage.getItem(SAVED_ANALYSES_KEY) || "[]")
          : [],
      settings,
    }

    downloadJson("kestrel-export.json", payload)
    setExportMessage("Your Kestrel data export was downloaded.")
    setTimeout(() => setExportMessage(""), 2000)
  }

  const handleDownloadPrivacyExport = () => {
    handleExportAllData()
  }

  const handleClearAnalysisHistory = () => {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(SAVED_ANALYSES_KEY)
    setDangerMessage("Saved analyses were cleared.")
    setTimeout(() => setDangerMessage(""), 2000)
  }

  const handleDeleteAccount = () => {
    if (typeof window === "undefined") return

    const keysToClear = [
      "kestrel_demo_user",
      EDITABLE_PROFILE_KEY,
      SAVED_PROFILE_KEY,
      SAVED_ANALYSES_KEY,
      SETTINGS_STORAGE_KEY,
    ]

    keysToClear.forEach((key) => window.localStorage.removeItem(key))
    setDemoUser(null)
    setAccountForm({
      firstName: "",
      lastName: "",
      email: "",
      headline: "",
      location: "",
      linkedin: "",
    })
    setDangerMessage("Demo account data was cleared on this device.")
  }

  const setNotification = <K extends keyof AppSettings["notifications"]>(
    key: K,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  const setPrivacy = <K extends keyof AppSettings["privacy"]>(key: K, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }

  const setAppearance = <K extends keyof AppSettings["appearance"]>(
    key: K,
    value: AppSettings["appearance"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value,
      },
    }))
  }

  const setConnected = <K extends keyof AppSettings["connected"]>(key: K, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      connected: {
        ...prev.connected,
        [key]: value,
      },
    }))
  }

  if (!mounted) return null

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166]">
          Settings
        </h1>
        <p className="mt-1 text-[#6B6F8E]">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-[#4FA7A7] text-white"
                  : "bg-white/50 text-[#6B6F8E] hover:text-[#3C4166] hover:bg-white border border-[#3C4166]/10"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === "account" && (
        <div className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader>
              <CardTitle className="text-lg text-[#3C4166]">Profile Information</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#C9B6E4] to-[#F7C7D4] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="border-[#3C4166]/20 text-[#3C4166] mb-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Avatar Placeholder
                  </Button>
                  <p className="text-xs text-[#6B6F8E]">Avatar initials reflect your saved account info.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">First Name</label>
                  <Input
                    type="text"
                    value={accountForm.firstName}
                    onChange={(e) =>
                      setAccountForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className="w-full h-10 rounded-xl border-[#3C4166]/10 bg-white/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Last Name</label>
                  <Input
                    type="text"
                    value={accountForm.lastName}
                    onChange={(e) =>
                      setAccountForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className="w-full h-10 rounded-xl border-[#3C4166]/10 bg-white/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    value={accountForm.email}
                    onChange={(e) =>
                      setAccountForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full h-10 rounded-xl border-[#3C4166]/10 bg-white/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Headline</label>
                  <Input
                    type="text"
                    value={accountForm.headline}
                    onChange={(e) =>
                      setAccountForm((prev) => ({ ...prev, headline: e.target.value }))
                    }
                    placeholder="Add a concise professional headline"
                    className="w-full h-10 rounded-xl border-[#3C4166]/10 bg-white/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Location</label>
                  <Input
                    type="text"
                    value={accountForm.location}
                    onChange={(e) =>
                      setAccountForm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="Add your location"
                    className="w-full h-10 rounded-xl border-[#3C4166]/10 bg-white/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">LinkedIn</label>
                  <Input
                    type="text"
                    value={accountForm.linkedin}
                    onChange={(e) =>
                      setAccountForm((prev) => ({ ...prev, linkedin: e.target.value }))
                    }
                    placeholder="Add your LinkedIn URL"
                    className="w-full h-10 rounded-xl border-[#3C4166]/10 bg-white/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-[#6B6F8E]">
                  {accountSaved ? "Changes saved." : "Saving here updates your account and profile defaults."}
                </div>
                <Button className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-full" onClick={handleSaveAccount}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader>
              <CardTitle className="text-lg text-[#3C4166]">Password</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                Demo password controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Current Password</label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full h-10 rounded-xl border-[#3C4166]/10 bg-white/50"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">New Password</label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    placeholder="••••••••"
                    className="w-full h-10 rounded-xl border-[#3C4166]/10 bg-white/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Confirm Password</label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    placeholder="••••••••"
                    className="w-full h-10 rounded-xl border-[#3C4166]/10 bg-white/50"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B6F8E]">{passwordMessage || "For demo purposes, this validates the form and clears it."}</p>
                <Button variant="outline" className="border-[#3C4166]/20 text-[#3C4166]" onClick={handlePasswordUpdate}>
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#FF8FA3]/20">
            <CardHeader>
              <CardTitle className="text-lg text-[#FF8FA3]">Danger Zone</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                Actions for your locally stored demo data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FF8FA3]/5 border border-[#FF8FA3]/20">
                <div>
                  <p className="text-sm font-medium text-[#3C4166]">Export All Data</p>
                  <p className="text-sm text-[#6B6F8E]">Download your current Kestrel demo data as JSON</p>
                </div>
                <Button variant="outline" className="border-[#3C4166]/20 text-[#3C4166]" onClick={handleExportAllData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FF8FA3]/5 border border-[#FF8FA3]/20">
                <div>
                  <p className="text-sm font-medium text-[#3C4166]">Delete Account</p>
                  <p className="text-sm text-[#6B6F8E]">Clear this device’s saved demo account and app state</p>
                </div>
                <Button variant="outline" className="border-[#FF8FA3] text-[#FF8FA3] hover:bg-[#FF8FA3]/10" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
              {exportMessage ? <p className="text-sm text-[#4FA7A7]">{exportMessage}</p> : null}
              {dangerMessage ? <p className="text-sm text-[#FF8FA3]">{dangerMessage}</p> : null}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader>
              <CardTitle className="text-lg text-[#3C4166]">Email Notifications</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                Choose what updates you want to receive via email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  ["analysisComplete", "Analysis Complete", "Get notified when your analysis is ready"],
                  ["weeklyProgress", "Weekly Progress Report", "Summary of your roadmap progress"],
                  ["milestoneReminders", "Milestone Reminders", "Reminders for upcoming milestones"],
                  ["newFeatures", "New Features", "Updates about new Kestrel features"],
                  ["tipsResources", "Tips & Resources", "Career tips and learning resources"],
                ].map(([key, title, description]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
                    <div>
                      <p className="font-medium text-[#3C4166]">{title}</p>
                      <p className="text-sm text-[#6B6F8E]">{description}</p>
                    </div>
                    <Switch
                      checked={settings.notifications[key as keyof AppSettings["notifications"]]}
                      onCheckedChange={(value) =>
                        setNotification(key as keyof AppSettings["notifications"], value)
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader>
              <CardTitle className="text-lg text-[#3C4166]">Push Notifications</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                Browser and mobile push notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  ["pushAnalysisReady", "Analysis Ready", "Push notification when analysis completes"],
                  ["pushRoadmapUpdates", "Roadmap Updates", "Updates to your career roadmap"],
                ].map(([key, title, description]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
                    <div>
                      <p className="font-medium text-[#3C4166]">{title}</p>
                      <p className="text-sm text-[#6B6F8E]">{description}</p>
                    </div>
                    <Switch
                      checked={settings.notifications[key as keyof AppSettings["notifications"]]}
                      onCheckedChange={(value) =>
                        setNotification(key as keyof AppSettings["notifications"], value)
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader>
              <CardTitle className="text-lg text-[#3C4166]">Data Privacy</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                Control how your data is used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                ["analytics", "Analytics", "Help improve Kestrel with anonymous usage data"],
                ["profileVisibility", "Profile Visibility", "Allow recruiters to discover your profile"],
                ["resumeSharing", "Resume Sharing", "Allow your resume to be shared with partners"],
                ["aiTraining", "AI Training", "Allow your data to improve AI models"],
              ].map(([key, title, description]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
                  <div>
                    <p className="font-medium text-[#3C4166]">{title}</p>
                    <p className="text-sm text-[#6B6F8E]">{description}</p>
                  </div>
                  <Switch
                    checked={settings.privacy[key as keyof AppSettings["privacy"]]}
                    onCheckedChange={(value) =>
                      setPrivacy(key as keyof AppSettings["privacy"], value)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader>
              <CardTitle className="text-lg text-[#3C4166]">Data Management</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                Manage your stored data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
                <div>
                  <p className="font-medium text-[#3C4166]">Download Your Data</p>
                  <p className="text-sm text-[#6B6F8E]">Get a copy of all your Kestrel data</p>
                </div>
                <Button variant="outline" size="sm" className="border-[#3C4166]/20 text-[#3C4166]" onClick={handleDownloadPrivacyExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Request Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
                <div>
                  <p className="font-medium text-[#3C4166]">Clear Analysis History</p>
                  <p className="text-sm text-[#6B6F8E]">Delete all saved analyses from this device</p>
                </div>
                <Button variant="outline" size="sm" className="border-[#FF8FA3] text-[#FF8FA3] hover:bg-[#FF8FA3]/10" onClick={handleClearAnalysisHistory}>
                  Clear History
                </Button>
              </div>

              {exportMessage ? <p className="text-sm text-[#4FA7A7]">{exportMessage}</p> : null}
              {dangerMessage ? <p className="text-sm text-[#FF8FA3]">{dangerMessage}</p> : null}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "appearance" && (
        <div className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader>
              <CardTitle className="text-lg text-[#3C4166]">Theme</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                Customize how Kestrel looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  ["light", "Light", <Sun key="sun" className="h-5 w-5 text-[#E87BF1]" />, "bg-[#F6F1E7] border border-[#3C4166]/10"],
                  ["dark", "Dark", <Moon key="moon" className="h-5 w-5 text-[#C9B6E4]" />, "bg-[#3C4166]"],
                  ["system", "System", <Monitor key="monitor" className="h-5 w-5 text-white" />, "bg-gradient-to-r from-[#F6F1E7] to-[#3C4166]"],
                ].map(([value, label, icon, preview]) => (
                  <button
                    key={value}
                    onClick={() =>
                      setAppearance("theme", value as AppSettings["appearance"]["theme"])
                    }
                    className={cn(
                      "p-4 rounded-xl border-2 text-center transition-all",
                      settings.appearance.theme === value
                        ? "border-[#4FA7A7] bg-[#F6F1E7]"
                        : "border-[#3C4166]/10 bg-white hover:border-[#3C4166]/20"
                    )}
                  >
                    <div className={cn("h-12 w-full rounded-lg mb-3 flex items-center justify-center", preview)}>
                      {icon}
                    </div>
                    <span className="text-sm font-medium text-[#3C4166]">{label}</span>
                    {settings.appearance.theme === value && (
                      <Check className="h-4 w-4 text-[#4FA7A7] mx-auto mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader>
              <CardTitle className="text-lg text-[#3C4166]">Display</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                Customize your display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
                <div>
                  <p className="font-medium text-[#3C4166]">Compact Mode</p>
                  <p className="text-sm text-[#6B6F8E]">Show more content with smaller spacing</p>
                </div>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(value) => setAppearance("compactMode", value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
                <div>
                  <p className="font-medium text-[#3C4166]">Animations</p>
                  <p className="text-sm text-[#6B6F8E]">Enable UI animations and transitions</p>
                </div>
                <Switch
                  checked={settings.appearance.animations}
                  onCheckedChange={(value) => setAppearance("animations", value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "connected" && (
        <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
          <CardHeader>
            <CardTitle className="text-lg text-[#3C4166]">Connected Accounts</CardTitle>
            <CardDescription className="text-[#6B6F8E]">
              Link external services to enhance your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["linkedin", "LinkedIn", "Import profile and sync data", "#0A66C2"],
              ["googleDrive", "Google Drive", "Sync resumes and documents", "#34A853"],
              ["github", "GitHub", "Import projects for portfolio", "#24292e"],
              ["notion", "Notion", "Sync notes and documents", "#000000"],
            ].map(([key, name, description, color]) => {
              const connected = settings.connected[key as keyof AppSettings["connected"]]
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: color }}
                    >
                      <Link2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-[#3C4166]">{name}</p>
                      <p className="text-sm text-[#6B6F8E]">{description}</p>
                    </div>
                  </div>

                  <Button
                    variant={connected ? "outline" : "default"}
                    className={
                      connected
                        ? "border-[#3C4166]/20 text-[#3C4166]"
                        : "bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white"
                    }
                    onClick={() =>
                      setConnected(key as keyof AppSettings["connected"], !connected)
                    }
                  >
                    {connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
            <CardHeader>
              <CardTitle className="text-lg text-[#3C4166]">Current Plan</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                Billing is placeholder-only for now, but the controls have a purpose.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-[#4FA7A7]/20 bg-gradient-to-r from-[#4FA7A7]/10 to-[#7ED7F7]/10 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6B6F8E]">Plan</p>
                    <h3 className="text-xl font-semibold text-[#3C4166]">Free</h3>
                    <p className="text-sm text-[#6B6F8E] mt-1">Good for demos and local state testing</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#4FA7A7] text-white text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
                <div>
                  <p className="font-medium text-[#3C4166]">Auto Renew</p>
                  <p className="text-sm text-[#6B6F8E]">Stores your billing preference for later use</p>
                </div>
                <Switch
                  checked={settings.billing.autoRenew}
                  onCheckedChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      billing: { ...prev.billing, autoRenew: value },
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-[#3C4166]/20 text-[#3C4166]">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Billing Placeholder
                </Button>
                <Button variant="outline" className="border-[#3C4166]/20 text-[#3C4166]" onClick={handleExportAllData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Receipt Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-[#FF8FA3]/20">
            <CardHeader>
              <CardTitle className="text-lg text-[#FF8FA3]">Billing Notice</CardTitle>
              <CardDescription className="text-[#6B6F8E]">
                This is a demo billing area for product completeness.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-[#FF8FA3] mt-0.5" />
              <p className="text-sm text-[#6B6F8E]">
                No real billing provider is connected yet. This section now stores your billing preferences and export actions so it is no longer dead UI.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}