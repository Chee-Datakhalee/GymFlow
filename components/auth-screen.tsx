"use client"
import { useState } from "react"
import { Mail, Lock, Dumbbell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

type Mode = "login" | "cadastro"
type Tipo = "aluno" | "academia"

export function AuthScreen({
  onAuth,
  soAluno = false,
}: {
  onAuth: (tipo: Tipo) => void
  soAluno?: boolean
}) {
  const [mode, setMode] = useState<Mode>("cadastro")
  const [tipo, setTipo] = useState<Tipo>(soAluno ? "aluno" : "aluno")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  async function handleSubmit() {
    setErro("")
    if (!email || !password) {
      setErro("Preencha email e senha")
      return
    }
    if (password.length < 6) {
      setErro("Senha mínimo 6 caracteres")
      return
    }
    setLoading(true)

    if (mode === "cadastro") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { tipo } }
      })
      if (error) { setErro(error.message); setLoading(false); return }

      // Se vier de link de academia, vincula o aluno
      if (tipo === "aluno" && data.user) {
        const academiaId = localStorage.getItem('academia_id')
        if (academiaId) {
          await supabase.from('alunos').insert({
            profile_id: data.user.id,
            academia_id: academiaId,
          })
          localStorage.removeItem('academia_id')
          localStorage.removeItem('academia_slug')
        }
      }

      onAuth(tipo)
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setErro("Email ou senha incorretos"); setLoading(false); return }
      const t = data.user?.user_metadata?.tipo as Tipo || "aluno"
      onAuth(t)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">

        {!soAluno && (
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary neon-glow">
              <Dumbbell className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Gym<span className="text-primary">Flow</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login" ? "Bem vindo de volta" : "Crie sua conta"}
            </p>
          </div>
        )}

        {/* Toggle Login/Cadastro */}
        <div className="mb-6 flex rounded-xl bg-secondary p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              mode === "login" ? "bg-primary text-primary-foreground neon-glow" : "text-muted-foreground"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode("cadastro")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              mode === "cadastro" ? "bg-primary text-primary-foreground neon-glow" : "text-muted-foreground"
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Escolha aluno ou academia (só no cadastro e se não for soAluno) */}
        {mode === "cadastro" && !soAluno && (
          <div className="mb-4 flex gap-3">
            <button
              onClick={() => setTipo("aluno")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                tipo === "aluno" ? "border-primary text-primary neon-glow" : "border-border text-muted-foreground"
              }`}
            >
              <User className="h-4 w-4" /> Sou Aluno
            </button>
            <button
              onClick={() => setTipo("academia")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                tipo === "academia" ? "border-primary text-primary neon-glow" : "border-border text-muted-foreground"
              }`}
            >
              <Dumbbell className="h-4 w-4" /> Sou Academia
            </button>
          </div>
        )}

        {/* Form */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>

            {erro && (
              <p className="text-center text-sm text-red-400">{erro}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground neon-glow hover:bg-primary/90"
            >
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
