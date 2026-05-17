"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, User, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

const goals = ["Hipertrofia", "Emagrecimento", "Condicionamento"]

export function OnboardingScreen({
  step,
  onNext,
  onSwitchToAcademy,
}: {
  step: number
  onNext: () => void
  onSwitchToAcademy: () => void
}) {
  const [name, setName] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [cep, setCep] = useState("")
  const [cidade, setCidade] = useState("")
  const [selectedGoal, setSelectedGoal] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [erro, setErro] = useState("")

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleCepChange(value: string) {
    const cleaned = value.replace(/\D/g, '')
    setCep(cleaned)
    if (cleaned.length === 8) {
      setLoadingCep(true)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setCidade(`${data.localidade} — ${data.uf}`)
        } else {
          setCidade("")
        }
      } catch {
        setCidade("")
      } finally {
        setLoadingCep(false)
      }
    } else {
      setCidade("")
    }
  }

 async function handleNext() {
    setErro("")

    if (step === 1) {
      if (!name.trim()) { setErro("Digite seu nome completo"); return }
      if (!avatarFile && !avatarPreview) { setErro("Adicione uma foto de perfil"); return }
      onNext()
      return
    }

    if (step === 2) {
      if (!weight) { setErro("Digite seu peso"); return }
      if (!height) { setErro("Digite sua altura"); return }
      if (!cep || cep.length < 8) { setErro("Digite um CEP válido"); return }
      if (!cidade) { setErro("CEP não encontrado, verifique"); return }
      onNext()
      return
    }

    if (step === 3) {
      if (!selectedGoal) { setErro("Selecione um objetivo"); return }
      setLoading(true)

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Usuário não encontrado")

        let fotoUrl = null
        if (avatarFile) {
          const ext = avatarFile.name.split('.').pop()
          const path = `${user.id}/avatar.${ext}`
          const { error: uploadError } = await supabase.storage
            .from('Avatar')
            .upload(path, avatarFile, { upsert: true })
          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('Avatar')
              .getPublicUrl(path)
            fotoUrl = urlData.publicUrl
          }
        }

        await supabase.from('profiles').upsert({
          id: user.id,
          tipo: 'aluno',
          nome: name,
          email: user.email || '',
          foto_url: fotoUrl,
          cep: cep,
          cidade: cidade,
        }, { onConflict: 'id' })

        const { data: alunoExistente } = await supabase
          .from('alunos')
          .select('id')
          .eq('profile_id', user.id)
          .single()

        if (!alunoExistente) {
          const academiaId = localStorage.getItem('academia_id') || null
          await supabase.from('alunos').insert({
            profile_id: user.id,
            academia_id: academiaId,
            peso: parseFloat(weight),
            altura: parseFloat(height),
            objetivo: selectedGoal.toLowerCase(),
          })
          if (academiaId) {
            localStorage.removeItem('academia_id')
            localStorage.removeItem('academia_slug')
          }
        }

        onNext()
      } catch (e: any) {
        setErro("Erro ao salvar. Tente novamente.")
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
  }
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col px-6 py-8">
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Gym<span className="text-primary">Flow</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === 1 && "Vamos comecar com seu perfil"}
            {step === 2 && "Conte mais sobre voce"}
            {step === 3 && "Qual seu objetivo?"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <label className="mx-auto flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-secondary transition-colors hover:border-primary overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Camera className="h-6 w-6 text-primary" />
                      <span className="text-xs text-muted-foreground">Foto</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-muted-foreground">Nome completo</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="weight" className="text-muted-foreground">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="80"
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="height" className="text-muted-foreground">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="178"
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cep" className="text-muted-foreground">CEP</Label>
                  <Input
                    id="cep"
                    type="text"
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    placeholder="00000000"
                    maxLength={8}
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                  {loadingCep && (
                    <p className="text-xs text-muted-foreground">Buscando cidade...</p>
                  )}
                  {cidade && (
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{cidade}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setSelectedGoal(goal)}
                    className={`glass flex items-center justify-between rounded-xl p-4 transition-all ${
                      selectedGoal === goal
                        ? "border-primary neon-glow"
                        : "border-transparent hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        selectedGoal === goal ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}>
                        <User className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-foreground">{goal}</span>
                    </div>
                    <ChevronRight className={`h-5 w-5 ${
                      selectedGoal === goal ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {erro && (
          <p className="mt-2 text-center text-sm text-red-400">{erro}</p>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Button
            onClick={handleNext}
            disabled={loading}
            className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground neon-glow hover:bg-primary/90"
          >
            {loading ? "Salvando..." : step === 3 ? "Comecar" : "Continuar"}
          </Button>
          <button
            onClick={onSwitchToAcademy}
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Sou academia
          </button>
        </div>
      </div>
    </div>
  )
}
