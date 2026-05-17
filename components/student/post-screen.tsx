"use client"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Camera, ImageIcon, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export function PostScreen({ onClose }: { onClose: () => void }) {
  const [posted, setPosted] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handlePost() {
    if (!file) { setErro("Selecione uma foto primeiro"); return }
    setLoading(true)
    setErro("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Não autenticado")

      const { data: aluno } = await supabase
        .from('alunos')
        .select('id, academia_id')
        .eq('profile_id', user.id)
        .single()

      if (!aluno) throw new Error("Aluno não encontrado")

      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('posts').getPublicUrl(path)
      const fotoUrl = urlData.publicUrl

      const { error: postError } = await supabase.from('posts').insert({
        aluno_id: aluno.id,
        academia_id: aluno.academia_id,
        foto_url: fotoUrl,
        tipo: 'foto',
        total_fogo: 0,
      })

      if (postError) throw postError

      // Cria story automático
      await supabase.from('stories').insert({
        aluno_id: aluno.id,
        academia_id: aluno.academia_id,
        foto_url: fotoUrl,
      })

      setPosted(true)
    } catch (e: any) {
      setErro("Erro ao postar. Tente novamente.")
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (posted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="mx-auto w-full max-w-[430px] px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary neon-glow"
          >
            <Check className="h-12 w-12 text-primary-foreground" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground"
          >
            Postado!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-muted-foreground"
          >
            Sua foto já está no feed
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-xl border-border text-foreground"
            >
              Voltar ao Feed
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-[430px]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <button onClick={onClose}>
            <X className="h-6 w-6 text-foreground" />
          </button>
          <span className="font-semibold text-foreground">Nova Foto</span>
          <div className="w-6" />
        </div>

        <div
          className="aspect-square w-full bg-secondary cursor-pointer overflow-hidden"
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
              <Camera className="h-16 w-16" />
              <p className="text-sm">Toque para escolher uma foto</p>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="border-t border-border p-4">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm text-foreground transition-colors hover:bg-secondary/80"
          >
            <ImageIcon className="h-5 w-5" />
            Escolher da galeria
          </button>
        </div>

        {erro && <p className="px-4 text-center text-sm text-red-400">{erro}</p>}

        <div className="px-4 pb-4">
          <Button
            onClick={handlePost}
            disabled={loading || !file}
            className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground neon-glow hover:bg-primary/90"
          >
            {loading ? "Postando..." : "Postar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
