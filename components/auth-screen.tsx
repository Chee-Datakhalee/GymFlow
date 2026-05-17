"use client"
import { useState } from "react"
import { Mail, Lock, Dumbbell, User, Building2, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

type Mode = "login" | "cadastro"
type Tipo = "aluno" | "academia"

function formatCNPJ(value: string): string {
  const c = value.replace(/\D/g, '').slice(0, 14)
  return c
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function validarCNPJ(cnpj: string): boolean {
  const c = cnpj.replace(/\D/g, '')
  if (c.length !== 14) return false
  if (/^(\d)\1+$/.test(c)) return false
  let sum = 0, pos = 5
  for (let i = 0; i < 12; i++) { sum += parseInt(c[i]) * pos--; if (pos < 2) pos = 9 }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(c[12])) return false
  sum = 0; pos = 6
  for (let i = 0; i < 13; i++) { sum += parseInt(c[i]) * pos--; if (pos < 2) pos = 9 }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return result === parseInt(c[13])
}

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

  // Academia fields
  const [cnpj, setCnpj] = useState("")
  const [cnpjData, setCnpjData] = useState<any>(null)
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [cnpjErro, setCnpjErro] = useState("")
  const [telefone, setTelefone] = useState("")

  async function handleCnpjChange(value: string) {
    const formatted = formatCNPJ(value)
    setCnpj(formatted)
    setCnpjData(null)
    setCnpjErro("")

    const raw = formatted.replace(/\D/g, '')
    if (raw.length === 14) {
      if (!validarCNPJ(raw)) { setCnpjErro("CNPJ inválido"); return }
      setLoadingCnpj(true)
      try {
        const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${raw}`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (data.descricao_situacao_cadastral !== 'ATIVA') {
          setCnpjErro("CNPJ não está ativo na Receita Federal")
          setLoadingCnpj(false)
          return
        }
        setCnpjData(data)
        if (data.ddd_telefone_1) {
          const tel = data.ddd_telefone_1
          setTelefone(`(${tel.slice(0,2)}) ${tel.slice(2)}`)
        }
      } catch {
        setCnpjErro("CNPJ não encontrado")
      } finally {
        setLoadingCnpj(false)
      }
    }
  }

  async function handleSubmit() {
    setErro("")

    if (!email || !password) { setErro("Preencha email e senha"); return }
    if (password.length < 6) { setErro("Senha mínimo 6 caracteres"); return }

    if (mode === "cadastro" && tipo === "academia") {
      if (!cnpjData) { setErro("Digite um CNPJ válido para continuar"); return }
    }

    setLoading(true)

    if (mode === "cadastro") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { tipo } }
      })
      if (error) { setErro(error.message); setLoading(false); return }

      if (tipo === "aluno" && data.user) {
        const academiaId = localStorage.getItem('academia_id')
        if (academiaId) {
          await supabase.from('alunos').insert({ profile_id: data.user.id, academia_id: academiaId })
          localStorage.removeItem('academia_id')
          localStorage.removeItem('academia_slug')
        }
      }

      if (tipo === "academia" && data.user && cnpjData) {
        // Salva profile
        await supabase.from('profiles').upsert({
          id: data.user.id,
          tipo: 'academia',
          nome: cnpjData.nome_fantasia || cnpjData.razao_social,
          email: email,
          cidade: `${cnpjData.municipio} — ${cnpjData.uf}`,
          cep: cnpjData.cep,
          cnpj: cnpjData.cnpj,
        }, { onConflict: 'id' })

        // Gera slug
        const nome = cnpjData.nome_fantasia || cnpjData.razao_social
        const slug = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

        // Cria academia
        await supabase.from('academias').insert({
          profile_id: data.user.id,
          nome: nome,
          slug: slug,
          telefone: telefone,
          cnpj: cnpjData.cnpj,
          cidade: `${cnpjData.municipio} — ${cnpjData.uf}`,
          cep: cnpjData.cep,
        })
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
      <div className="w-full max-w-md px-6 py-8">

        {!soAluno && (
          <div className="mb-8 text-center">
            <img src="/LOGO-GYN-FLOW.png" alt="GymFlow" className="mx-auto mb-2" style={{height:'72px'}} />
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login" ? "Bem vindo de volta" : "Crie sua conta"}
            </p>
          </div>
        )}

        {/* Toggle Login/Cadastro */}
        <div className="mb-6 flex rounded-xl bg-secondary p-1">
          <button onClick={() => setMode("login")} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === "login" ? "bg-primary text-primary-foreground neon-glow" : "text-muted-foreground"}`}>
            Entrar
          </button>
          <button onClick={() => setMode("cadastro")} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === "cadastro" ? "bg-primary text-primary-foreground neon-glow" : "text-muted-foreground"}`}>
            Cadastrar
          </button>
        </div>

        {/* Escolha aluno ou academia */}
        {mode === "cadastro" && !soAluno && (
          <div className="mb-4 flex gap-3">
            <button onClick={() => setTipo("aluno")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${tipo === "aluno" ? "border-primary text-primary neon-glow" : "border-border text-muted-foreground"}`}>
              <User className="h-4 w-4" /> Sou Aluno
            </button>
            <button onClick={() => setTipo("academia")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${tipo === "academia" ? "border-primary text-primary neon-glow" : "border-border text-muted-foreground"}`}>
              <Dumbbell className="h-4 w-4" /> Sou Academia
            </button>
          </div>
        )}

        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col gap-4">

            {/* CNPJ — só no cadastro de academia */}
            {mode === "cadastro" && tipo === "academia" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label className="text-muted-foreground">CNPJ da academia</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      value={cnpj}
                      onChange={(e) => handleCnpjChange(e.target.value)}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>
                  {loadingCnpj && <p className="text-xs text-muted-foreground">Buscando CNPJ...</p>}
                  {cnpjErro && <p className="text-xs text-red-400">{cnpjErro}</p>}
                </div>

                {/* Dados da empresa autocomplete */}
                {cnpjData && (
                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-xs text-primary font-medium">CNPJ verificado — {cnpjData.descricao_situacao_cadastral}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{cnpjData.nome_fantasia || cnpjData.razao_social}</p>
                      {cnpjData.nome_fantasia && <p className="text-xs text-muted-foreground">{cnpjData.razao_social}</p>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{cnpjData.descricao_tipo_de_logradouro} {cnpjData.logradouro}, {cnpjData.numero} — {cnpjData.municipio}/{cnpjData.uf}</span>
                    </div>
                  </div>
                )}

                {/* Telefone */}
                {cnpjData && (
                  <div className="flex flex-col gap-2">
                    <Label className="text-muted-foreground">Telefone / WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email */}
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

            {/* Senha */}
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
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
