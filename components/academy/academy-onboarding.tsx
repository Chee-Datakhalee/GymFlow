"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export function AcademyOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1)
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [cep, setCep] = useState("")
  const [cidade, setCidade] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [erro, setErro] = useState("")

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  function validarCNPJ(cnpj: string): boolean {
    const c = cnpj.replace(/\D/g, '')
    if (c.length !== 14) return false
    if (/^(\d)\1+$/.test(c)) return false
    let sum = 0
    let pos = 5
    for (let i = 0; i < 12; i++) {
      sum += parseInt(c[i]) * pos--
      if (pos < 2) pos = 9
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== parseInt(c[12])) return false
    sum = 0
    pos = 6
    for (let i = 0; i < 13; i++) {
      sum += parseInt(c[i]) * pos--
      if (pos < 2) pos = 9
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    return result === parseInt(c[13])
  }

  function formatCNPJ(value: string): string {
    const c = value.replace(/\D/g, '').slice(0, 14)
    return c
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  async function handleCepChange(value: string) {
    const cleaned = value.replace(/\D/g, '')
    setCep(cleaned)
    if (cleaned.length === 8) {
      setLoadingCep(true)
      try {
        const res = await fetch(`/api/cep?cep=${cleaned}`)
        const data = await res.json()
        if (!data.erro) setCidade(`${data.localidade} — ${data.uf}`)
        else setCidade("")
      } catch { setCidade("") }
      finally { setLoadingCep(false) }
    } else { setCidade("") }
  }

  async function handleNext() {
    setErro("")

    if (step === 1) {
      if (!logoFile) { setErro("Adicione o logo da academia"); return }
      if (!nome.trim()) { setErro("Digite o nome da academia"); return }
      if (!telefone.trim()) { setErro("Digite o telefone"); return }
      if (!cnpj || !validarCNPJ(cnpj)) { setErro("CNPJ inválido"); return }
      setStep(2)
      return
    }

    if (step === 2) {
      if (!cep || cep.length < 8) { setErro("Digite um CEP válido"); return }
      if (!cidade) { setErro("CEP não encontrado"); return }
      setLoading(true)

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Usuário não encontrado")

        let logoUrl = null
        if (logoFile) {
          const ext = logoFile.name.split('.').pop()
          const path = `${user.id}/logo.${ext}`
          const { error: uploadError } = await supabase.storage
            .from('logos')
            .upload(path, logoFile, { upsert: true })
          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('logos').getPublicUrl(path)
            logoUrl = urlData.publicUrl
          }
        }

        const slug = nome
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        await supabase.from('profiles').upsert({
          id: user.id,
          tipo: 'academia',
          nome: nome,
          email: user.email || '',
          cep: cep,
          cidade: cidade,
          cnpj: cnpj.replace(/\D/g, ''),
        }, { onConflict: 'id' })

        const { error: acadError } = await supabase.from('academias').insert({
          profile_id: user.id,
          nome: nome,
          slug: slug,
          telefone: telefone,
          logo_url: logoUrl,
          cep: cep,
          cidade: cidade,
          cnpj: cnpj.replace(/\D/g, ''),
        })

        if (acadError) {
          if (acadError.code === '23505') {
            setErro("Nome de academia já existe, tente outro")
          } else {
            throw acadError
          }
          setLoading(false)
          return
        }

        onComplete()
      } catch (e: any) {
        setErro("Erro ao salvar. Tente novamente.")
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md px-6 py-8">
        <div className="mb-8 flex items-center gap-2">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Gym<span className="text-primary">Flow</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === 1 ? "Configure sua academia" : "Localização da academia"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <label className="mx-auto flex h-28 w-28 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-primary/50 bg-secondary transition-colors hover:border-primary overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-6 w-6 text-primary" />
                      <span className="text-xs text-muted-foreground">Logo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>

                <div className="flex flex-col gap-2">
                  <Label className="text-muted-foreground">Nome da academia</Label>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Iron Fit Academia" className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-muted-foreground">Telefone / WhatsApp</Label>
                  <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-muted-foreground">CNPJ</Label>
                  <Input
                    value={cnpj}
                    onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-muted-foreground">CEP da academia</Label>
                  <Input
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    placeholder="00000000"
                    maxLength={8}
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                  {loadingCep && <p className="text-xs text-muted-foreground">Buscando cidade...</p>}
                  {cidade && (
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{cidade}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {erro && <p className="mt-4 text-center text-sm text-red-400">{erro}</p>}

        <div className="mt-8">
          <Button
            onClick={handleNext}
            disabled={loading}
            className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground neon-glow hover:bg-primary/90"
          >
            {loading ? "Salvando..." : step === 2 ? "Começar" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
