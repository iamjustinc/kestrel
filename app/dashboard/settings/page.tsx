"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
  Monitor
} from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "connected", label: "Connected", icon: Link2 },
  { id: "billing", label: "Billing", icon: CreditCard },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C4166]">
          Settings
        </h1>
        <p className="mt-1 text-[#6B6F8E]">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      {activeTab === "account" && <AccountSettings />}
      {activeTab === "notifications" && <NotificationSettings />}
      {activeTab === "privacy" && <PrivacySettings />}
      {activeTab === "appearance" && <AppearanceSettings />}
      {activeTab === "connected" && <ConnectedSettings />}
      {activeTab === "billing" && <BillingSettings />}
    </div>
  )
}

function AccountSettings() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
        <CardHeader>
          <CardTitle className="text-lg text-[#3C4166]">Profile Information</CardTitle>
          <CardDescription className="text-[#6B6F8E]">
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#C9B6E4] to-[#F7C7D4] flex items-center justify-center">
              <span className="text-2xl font-bold text-white">AJ</span>
            </div>
            <div>
              <Button variant="outline" size="sm" className="border-[#3C4166]/20 text-[#3C4166] mb-2">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-[#6B6F8E]">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">First Name</label>
              <input
                type="text"
                defaultValue="Alex"
                className="w-full h-10 rounded-xl border border-[#3C4166]/10 bg-white/50 px-4 text-sm text-[#3C4166] focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Last Name</label>
              <input
                type="text"
                defaultValue="Johnson"
                className="w-full h-10 rounded-xl border border-[#3C4166]/10 bg-white/50 px-4 text-sm text-[#3C4166] focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Email</label>
              <input
                type="email"
                defaultValue="alex@example.com"
                className="w-full h-10 rounded-xl border border-[#3C4166]/10 bg-white/50 px-4 text-sm text-[#3C4166] focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Headline</label>
              <input
                type="text"
                defaultValue="Product-minded engineer transitioning to PM"
                className="w-full h-10 rounded-xl border border-[#3C4166]/10 bg-white/50 px-4 text-sm text-[#3C4166] focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Location</label>
              <input
                type="text"
                defaultValue="San Francisco, CA"
                className="w-full h-10 rounded-xl border border-[#3C4166]/10 bg-white/50 px-4 text-sm text-[#3C4166] focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-[#4FA7A7] hover:bg-[#4FA7A7]/90 text-white rounded-full">
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
            Update your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-10 rounded-xl border border-[#3C4166]/10 bg-white/50 px-4 text-sm text-[#3C4166] focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-10 rounded-xl border border-[#3C4166]/10 bg-white/50 px-4 text-sm text-[#3C4166] focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#3C4166] mb-1.5 block">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-10 rounded-xl border border-[#3C4166]/10 bg-white/50 px-4 text-sm text-[#3C4166] focus:border-[#4FA7A7] focus:outline-none focus:ring-1 focus:ring-[#4FA7A7]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" className="border-[#3C4166]/20 text-[#3C4166]">
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-[#FF8FA3]/20">
        <CardHeader>
          <CardTitle className="text-lg text-[#FF8FA3]">Danger Zone</CardTitle>
          <CardDescription className="text-[#6B6F8E]">
            Irreversible actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#FF8FA3]/5 border border-[#FF8FA3]/20">
            <div>
              <p className="text-sm font-medium text-[#3C4166]">Export All Data</p>
              <p className="text-sm text-[#6B6F8E]">Download all your data as a ZIP file</p>
            </div>
            <Button variant="outline" className="border-[#3C4166]/20 text-[#3C4166]">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#FF8FA3]/5 border border-[#FF8FA3]/20">
            <div>
              <p className="text-sm font-medium text-[#3C4166]">Delete Account</p>
              <p className="text-sm text-[#6B6F8E]">Permanently delete your account and all data</p>
            </div>
            <Button variant="outline" className="border-[#FF8FA3] text-[#FF8FA3] hover:bg-[#FF8FA3]/10">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationSettings() {
  const emailNotifications = [
    { title: "Analysis Complete", description: "Get notified when your analysis is ready", enabled: true },
    { title: "Weekly Progress Report", description: "Summary of your roadmap progress", enabled: true },
    { title: "Milestone Reminders", description: "Reminders for upcoming milestones", enabled: true },
    { title: "New Features", description: "Updates about new Kestrel features", enabled: false },
    { title: "Tips & Resources", description: "Career tips and learning resources", enabled: true },
  ]

  const pushNotifications = [
    { title: "Analysis Ready", description: "Push notification when analysis completes", enabled: true },
    { title: "Roadmap Updates", description: "Updates to your career roadmap", enabled: false },
  ]

  return (
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
            {emailNotifications.map((notification) => (
              <div 
                key={notification.title}
                className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50"
              >
                <div>
                  <p className="font-medium text-[#3C4166]">{notification.title}</p>
                  <p className="text-sm text-[#6B6F8E]">{notification.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked={notification.enabled}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-[#3C4166]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4FA7A7]" />
                </label>
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
            {pushNotifications.map((notification) => (
              <div 
                key={notification.title}
                className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50"
              >
                <div>
                  <p className="font-medium text-[#3C4166]">{notification.title}</p>
                  <p className="text-sm text-[#6B6F8E]">{notification.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked={notification.enabled}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-[#3C4166]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4FA7A7]" />
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PrivacySettings() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
        <CardHeader>
          <CardTitle className="text-lg text-[#3C4166]">Data Privacy</CardTitle>
          <CardDescription className="text-[#6B6F8E]">
            Control how your data is used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
            <div>
              <p className="font-medium text-[#3C4166]">Analytics</p>
              <p className="text-sm text-[#6B6F8E]">Help improve Kestrel with anonymous usage data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-[#3C4166]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4FA7A7]" />
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
            <div>
              <p className="font-medium text-[#3C4166]">Profile Visibility</p>
              <p className="text-sm text-[#6B6F8E]">Allow recruiters to discover your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-[#3C4166]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4FA7A7]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
            <div>
              <p className="font-medium text-[#3C4166]">Resume Sharing</p>
              <p className="text-sm text-[#6B6F8E]">Allow your resume to be shared with partners</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-[#3C4166]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4FA7A7]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
            <div>
              <p className="font-medium text-[#3C4166]">AI Training</p>
              <p className="text-sm text-[#6B6F8E]">Allow your data to improve AI models</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-[#3C4166]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4FA7A7]" />
            </label>
          </div>
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
            <Button variant="outline" size="sm" className="border-[#3C4166]/20 text-[#3C4166]">
              <Download className="h-4 w-4 mr-2" />
              Request Export
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
            <div>
              <p className="font-medium text-[#3C4166]">Clear Analysis History</p>
              <p className="text-sm text-[#6B6F8E]">Delete all saved analyses</p>
            </div>
            <Button variant="outline" size="sm" className="border-[#FF8FA3] text-[#FF8FA3] hover:bg-[#FF8FA3]/10">
              Clear History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AppearanceSettings() {
  const [selectedTheme, setSelectedTheme] = useState("light")

  return (
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
            <button 
              onClick={() => setSelectedTheme("light")}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all",
                selectedTheme === "light"
                  ? "border-[#4FA7A7] bg-[#F6F1E7]"
                  : "border-[#3C4166]/10 bg-white hover:border-[#3C4166]/20"
              )}
            >
              <div className="h-12 w-full rounded-lg bg-[#F6F1E7] border border-[#3C4166]/10 mb-3 flex items-center justify-center">
                <Sun className="h-5 w-5 text-[#E87BF1]" />
              </div>
              <span className="text-sm font-medium text-[#3C4166]">Light</span>
              {selectedTheme === "light" && (
                <Check className="h-4 w-4 text-[#4FA7A7] mx-auto mt-2" />
              )}
            </button>
            <button 
              onClick={() => setSelectedTheme("dark")}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all",
                selectedTheme === "dark"
                  ? "border-[#4FA7A7] bg-[#F6F1E7]"
                  : "border-[#3C4166]/10 bg-white hover:border-[#3C4166]/20"
              )}
            >
              <div className="h-12 w-full rounded-lg bg-[#3C4166] mb-3 flex items-center justify-center">
                <Moon className="h-5 w-5 text-[#C9B6E4]" />
              </div>
              <span className="text-sm font-medium text-[#3C4166]">Dark</span>
              <span className="text-xs text-[#6B6F8E] block">(Coming Soon)</span>
            </button>
            <button 
              onClick={() => setSelectedTheme("system")}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all",
                selectedTheme === "system"
                  ? "border-[#4FA7A7] bg-[#F6F1E7]"
                  : "border-[#3C4166]/10 bg-white hover:border-[#3C4166]/20"
              )}
            >
              <div className="h-12 w-full rounded-lg bg-gradient-to-r from-[#F6F1E7] to-[#3C4166] mb-3 flex items-center justify-center">
                <Monitor className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-[#3C4166]">System</span>
              <span className="text-xs text-[#6B6F8E] block">(Coming Soon)</span>
            </button>
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
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-[#3C4166]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4FA7A7]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50">
            <div>
              <p className="font-medium text-[#3C4166]">Animations</p>
              <p className="text-sm text-[#6B6F8E]">Enable UI animations and transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-[#3C4166]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4FA7A7]" />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ConnectedSettings() {
  const connectedAccounts = [
    { 
      name: "LinkedIn", 
      description: "Import profile and sync data",
      connected: true, 
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color: "#0A66C2"
    },
    { 
      name: "Google Drive", 
      description: "Sync resumes and documents",
      connected: false, 
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.71 3.5L1.15 15l3.43 5.99L11.14 9.5 7.71 3.5zm1.44-.5h7.69l6.57 11.51h-7.69L9.15 3zm13.85 12H9.15l-3.43 6h13.85l3.43-6z"/>
        </svg>
      ),
      color: "#34A853"
    },
    { 
      name: "GitHub", 
      description: "Import projects for portfolio",
      connected: false, 
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.874.1 3.176.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      color: "#24292e"
    },
    { 
      name: "Notion", 
      description: "Sync notes and documents",
      connected: false, 
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.746 0-.933-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.22.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.62c-.094-.42.14-1.026.793-1.073l3.453-.233 4.763 7.278V9.014l-1.215-.14c-.093-.514.28-.887.747-.933zM2.877 1.175l13.588-.933c1.681-.14 2.1-.047 3.175.7l4.437 3.127c.746.56.98.7.98 1.307v14.25c0 1.12-.42 1.774-1.868 1.867l-15.457.933c-1.074.047-1.588-.093-2.147-.793L1.24 17.52c-.607-.747-.887-1.307-.887-1.96V2.896c0-.84.42-1.587 1.494-1.72z"/>
        </svg>
      ),
      color: "#000000"
    },
  ]

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
      <CardHeader>
        <CardTitle className="text-lg text-[#3C4166]">Connected Accounts</CardTitle>
        <CardDescription className="text-[#6B6F8E]">
          Link external services to enhance your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectedAccounts.map((account) => (
          <div 
            key={account.name}
            className="flex items-center justify-between p-4 rounded-xl bg-[#F6F1E7]/50 border border-[#3C4166]/5"
          >
            <div className="flex items-center gap-4">
              <div 
                className="h-12 w-12 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: account.color }}
              >
                {account.icon}
              </div>
              <div>
                <p className="font-medium text-[#3C4166]">{account.name}</p>
                <p className="text-sm text-[#6B6F8E]">{account.description}</p>
                {account.connected && (
                  <p className="text-xs text-[#4FA7A7] mt-1">Connected</p>
                )}
              </div>
            </div>
            {account.connected ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-[#3C4166]/20 text-[#3C4166]">
                  Sync
                </Button>
                <Button variant="ghost" size="sm" className="text-[#6B6F8E]">
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="border-[#4FA7A7] text-[#4FA7A7] hover:bg-[#4FA7A7]/10">
                Connect
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-[#4FA7A7] to-[#7ED7F7] border-0 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <CardContent className="py-8 relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80 mb-1">Current Plan</p>
              <h3 className="text-3xl font-bold">Free</h3>
              <p className="text-sm text-white/80 mt-2">5 analyses per month</p>
            </div>
            <Button className="bg-white text-[#4FA7A7] hover:bg-white/90 rounded-full px-6">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
        <CardHeader>
          <CardTitle className="text-lg text-[#3C4166]">Pro Plan Benefits</CardTitle>
          <CardDescription className="text-[#6B6F8E]">
            $12/month or $99/year (save 31%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Unlimited analyses",
              "Priority AI processing",
              "Advanced skill gap detection",
              "Resume optimization suggestions",
              "PDF exports",
              "Email support",
              "Custom roadmap templates",
              "API access"
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 p-2">
                <div className="h-5 w-5 rounded-full bg-[#C8F5DF] flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-[#4FA7A7]" />
                </div>
                <span className="text-sm text-[#3C4166]">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
        <CardHeader>
          <CardTitle className="text-lg text-[#3C4166]">Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#6B6F8E]">Analyses used</span>
                <span className="font-medium text-[#3C4166]">3 of 5</span>
              </div>
              <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-[#4FA7A7] to-[#7ED7F7]" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#6B6F8E]">Resume optimizations</span>
                <span className="font-medium text-[#3C4166]">2 of 3</span>
              </div>
              <div className="h-2 rounded-full bg-[#3C4166]/10 overflow-hidden">
                <div className="h-full w-[66%] rounded-full bg-gradient-to-r from-[#E87BF1] to-[#C9B6E4]" />
              </div>
            </div>
            <p className="text-xs text-[#6B6F8E]">Resets on April 1, 2026</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-[#3C4166]/10">
        <CardHeader>
          <CardTitle className="text-lg text-[#3C4166]">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-12 w-12 rounded-xl bg-[#F6F1E7] flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-[#6B6F8E]" />
            </div>
            <p className="text-[#6B6F8E]">No billing history yet</p>
            <p className="text-sm text-[#6B6F8E]/70 mt-1">Upgrade to Pro to see invoices here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
