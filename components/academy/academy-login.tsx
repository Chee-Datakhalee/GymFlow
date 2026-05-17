"use client"
import { useState } from "react"
import { Mail, Lock, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export function AcademyLogin({
  onLogin,
  onSwitchToStudent,
}: {
  onLogin: () => void
  onSwitchToStudent: () => void
}) {
  const [mode, setMode] = useState<"login" | "cadastro">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  async function handleSubmit() {
    setErro("")
    if (!email || !password) { setErro("Preencha email e senha"); return }
    if (password.length < 6) { setErro("Senha mínimo 6 caracteres"); return }
    setLoading(true)

    if (mode === "cadastro") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { tipo: 'academia' } }
      })
      if (error) { setErro(error.message); setLoading(false); return }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setErro("Email ou senha incorretos"); setLoading(false); return }
      if (data.user?.user_metadata?.tipo !== 'academia') {
        setErro("Essa conta não é de academia")
        await supabase.auth.signOut()
        setLoading(false)
        return
      }
    }

    setLoading(false)
    onLogin()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary neon-glow">
            <Dumbbell className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Gym<span className="text-primary">Flow</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Painel da Academia</p>
        </div>

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
                  placeholder="academia@email.com"
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

            {erro && <p className="text-center text-sm text-red-400">{erro}</p>}

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground neon-glow hover:bg-primary/90"
            >
              {loading ? "Aguarde..." : mode === "login" ? "Entrar como Academia" : "Criar conta Academia"}
            </Button>
          </div>
        </div>

        <button
          onClick={onSwitchToStudent}
          className="mt-4 block w-full text-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          Sou aluno
        </button>
      </div>
    </div>
  )
}
