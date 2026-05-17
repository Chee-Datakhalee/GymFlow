"use client"

import { useState } from "react"
import { AcademyLogin } from "./academy-login"
import { AcademySidebar } from "./academy-sidebar"
import { AcademyDashboard } from "./academy-dashboard"
import { AcademyStudents } from "./academy-students"
import { AcademyWorkouts } from "./academy-workouts"
import { AcademyRanking } from "./academy-ranking"
import { AcademyFinancial } from "./academy-financial"
import { AcademyNotifications } from "./academy-notifications"
import { AcademySettings } from "./academy-settings"

type AcademyScreen = "login" | "dashboard" | "students" | "workouts" | "ranking" | "financial" | "notifications" | "settings"

export function AcademyPanel({ onSwitchToStudent }: { onSwitchToStudent: () => void }) {
  const [screen, setScreen] = useState<AcademyScreen>("login")
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return (
      <AcademyLogin
        onLogin={() => { setLoggedIn(true); setScreen("dashboard") }}
        onSwitchToStudent={onSwitchToStudent}
      />
    )
  }

  const renderContent = () => {
    switch (screen) {
      case "dashboard": return <AcademyDashboard />
      case "students": return <AcademyStudents />
      case "workouts": return <AcademyWorkouts />
      case "ranking": return <AcademyRanking />
      case "financial": return <AcademyFinancial />
      case "notifications": return <AcademyNotifications />
      case "settings": return <AcademySettings />
      default: return <AcademyDashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AcademySidebar
        active={screen}
        onNavigate={(s) => setScreen(s as AcademyScreen)}
        onLogout={() => { setLoggedIn(false); setScreen("login") }}
      />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  )
}
