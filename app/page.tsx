"use client"
import { useState, useEffect } from "react"
import { StudentApp } from "@/components/student/student-app"
import { AcademyPanel } from "@/components/academy/academy-panel"
import { AuthScreen } from "@/components/auth-screen"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type Tipo = "aluno" | "academia"

export default function Home() {
  const [tipo, setTipo] = useState<Tipo | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push('/escolha')
        return
      }
      setTipo(session.user.user_metadata?.tipo || "aluno")
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push('/escolha')
        return
      }
      setTipo(session.user.user_metadata?.tipo || "aluno")
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (tipo === "academia") return <AcademyPanel onSwitchToStudent={() => setTipo("aluno")} />
  return <StudentApp onSwitchToAcademy={() => setTipo("academia")} />
}
