"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AuthScreen } from "@/components/auth-screen"
import { StudentApp } from "@/components/student/student-app"

export default function EntrarPage() {
  const { slug } = useParams()
  const [academia, setAcademia] = useState<any>(null)
  const [erro, setErro] = useState("")
  const [logado, setLogado] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Busca a academia pelo slug
    async function fetchAcademia() {
      const { data, error } = await supabase
        .from('academias')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        setErro("Academia não encontrada")
      } else {
        setAcademia(data)
        // Salva slug no localStorage para usar no cadastro
        localStorage.setItem('academia_slug', slug as string)
        localStorage.setItem('academia_id', data.id)
      }
      setLoading(false)
    }

    // Verifica se já tá logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setLogado(true)
        setLoading(false)
      } else {
        fetchAcademia()
      }
    })
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">Academia não encontrada</p>
          <p className="mt-2 text-sm text-muted-foreground">Verifique o link e tente novamente</p>
        </div>
      </div>
    )
  }

  if (logado) {
    return <StudentApp onSwitchToAcademy={() => {}} />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Banner da academia */}
      {academia && (
        <div className="flex flex-col items-center py-8">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl neon-glow"
            style={{ backgroundColor: academia.cor_primaria || '#00FF87' }}
          >
            <span className="text-2xl font-bold text-black">
              {academia.nome?.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="mt-3 text-lg font-bold text-foreground">{academia.nome}</p>
          <p className="text-sm text-muted-foreground">Crie sua conta para começar</p>
        </div>
      )}
      <AuthScreen onAuth={() => setLogado(true)} soAluno />
    </div>
  )
}
