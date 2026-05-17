"use client"
import { useState, useEffect } from "react"
import { AcademyLogin } from "./academy-login"
import { AcademyOnboarding } from "./academy-onboarding"
import { AcademySidebar } from "./academy-sidebar"
import { AcademyDashboard } from "./academy-dashboard"
import { AcademyStudents } from "./academy-students"
import { AcademyWorkouts } from "./academy-workouts"
import { AcademyRanking } from "./academy-ranking"
import { AcademyFinancial } from "./academy-financial"
import { AcademyNotifications } from "./academy-notifications"
import { AcademySettings } from "./academy-settings"
import { supabase } from "@/lib/supabase"

type AcademyScreen = "loading" | "login" | "onboarding" | "dashboard" | "students" | "workouts" | "ranking" | "financial" | "notifications" | "settings"

export function AcademyPanel({ onSwitchToStudent }: { onSwitchToStudent: () => void }) {
  const [screen, setScreen] = useState<AcademyScreen>("loading")

  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setScreen("login"); return }
      if (user.user_metadata?.tipo !== 'academia') { setScreen("login"); return }

      const { data: academia } = await supabase
        .from('academias')
        .select('id')
        .eq('profile_id', user.id)
        .single()

      if (!academia) { setScreen("onboarding"); return }
      setScreen("dashboard")
    }
    checkStatus()
  }, [])

  if (screen === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (screen === "login") {
    return (
      <AcademyLogin
        onLogin={async () => {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return
          const { data: academia } = await supabase
            .from('academias')
            .select('id')
            .eq('profile_id', user.id)
            .single()
          setScreen(academia ? "dashboard" : "onboarding")
        }}
        onSwitchToStudent={onSwitchToStudent}
      />
    )
  }

  if (screen === "onboarding") {
    return <AcademyOnboarding onComplete={() => setScreen("dashboard")} />
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
        onLogout={async () => {
          await supabase.auth.signOut()
          setScreen("login")
        }}
      />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  )
}
