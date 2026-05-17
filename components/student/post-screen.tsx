"use client"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Camera, ImageIcon, Video, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export function PostScreen({ onClose }: { onClose: () => void }) {
  const [posted, setPosted] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isVideo, setIsVideo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const fotoRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, tipo: 'foto' | 'video') {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setIsVideo(tipo === 'video')
    setPreview(URL.createObjectURL(f))
  }

  async function handlePost() {
    if (!file) { setErro("Selecione uma mídia primeiro"); return }
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
      const bucket = isVideo ? 'videos' : 'posts'

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
      const mediaUrl = urlData.publicUrl

      await supabase.from('posts').insert({
        aluno_id: aluno.id,
        academia_id: aluno.academia_id,
        foto_url: isVideo ? null : mediaUrl,
        video_url: isVideo ? mediaUrl : null,
        tipo: isVideo ? 'video' : 'foto',
        total_fogo: 0,
      })

      if (!isVideo) {
        await supabase.from('stories').insert({
          aluno_id: aluno.id,
          academia_id: aluno.academia_id,
          foto_url: mediaUrl,
        })
      }

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
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary neon-glow">
            <Check className="h-12 w-12 text-primary-foreground" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-foreground">Postado!</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-2 text-muted-foreground">Seu conteúdo já está no feed</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8">
            <Button onClick={onClose} variant="outline" className="rounded-xl border-border text-foreground">Voltar ao Feed</Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-[430px]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <button onClick={onClose}><X className="h-6 w-6 text-foreground" /></button>
          <span className="font-semibold text-foreground">Nova Publicação</span>
          <div className="w-6" />
        </div>

        <div className="aspect-square w-full bg-secondary cursor-pointer overflow-hidden" onClick={() => fotoRef.current?.click()}>
          {preview ? (
            isVideo ? (
              <video src={preview} className="h-full w-full object-cover" autoPlay muted loop playsInline />
            ) : (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
              <Camera className="h-16 w-16" />
              <p className="text-sm">Toque para escolher</p>
            </div>
          )}
        </div>

        <input ref={fotoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'foto')} />
        <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'video')} />

        <div className="border-t border-border p-4 flex gap-3">
          <button onClick={() => fotoRef.current?.click()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm text-foreground transition-colors hover:bg-secondary/80">
            <ImageIcon className="h-5 w-5" /> Foto
          </button>
          <button onClick={() => videoRef.current?.click()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm text-foreground transition-colors hover:bg-secondary/80">
            <Video className="h-5 w-5" /> Vídeo
          </button>
        </div>

        {erro && <p className="px-4 text-center text-sm text-red-400">{erro}</p>}

        <div className="px-4 pb-4">
          <Button onClick={handlePost} disabled={loading || !file} className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground neon-glow hover:bg-primary/90">
            {loading ? "Postando..." : "Postar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
