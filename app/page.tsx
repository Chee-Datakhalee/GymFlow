"use client"
import { useState, useEffect } from "react"
import { StudentApp } from "@/components/student/student-app"
import { AcademyPanel } from "@/components/academy/academy-panel"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [mode, setMode] = useState<"student" | "academy">("student")
  const [loading, setLoading] = useState(true) 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.tipo === 'academia') {
        setMode('academia')
      } else {
        setMode('student')
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.user_metadata?.tipo === 'academia') {
        setMode('academia')
      } else {
        setMode('student')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Carregando...</span>
        </div>
      </div>
    )
  }

  if (mode === "academy") {
    return <AcademyPanel onSwitchToStudent={() => setMode("student")} />
  }

  return <StudentApp onSwitchToAcademy={() => setMode("academy")} />
}
