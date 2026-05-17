"use client"

import { useState, useEffect, useRef } from "react"
import { Flame, Trophy, Clock, Grid3X3, ChevronRight, X, Trash2, Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"

type Profile = { nome: string; foto_url: string | null }
type Aluno = { id: string; streak: number; objetivo: string; academia_id: string | null }
type PR = { id: string; peso_kg: number; exercicio_id: string; exercicios: { nome: string } }

export function ProfileScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [prs, setPrs] = useState<PR[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [treinos, setTreinos] = useState<any[]>([])
  const [seguidores, setSeguidores] = useState(0)
  const [seguindo, setSeguindo] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<any | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const avatarRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const { data: prof } = await supabase.from('profiles').select('nome, foto_url').eq('id', user.id).single()
    const { data: al } = await supabase.from('alunos').select('id, streak, objetivo, academia_id').eq('profile_id', user.id).single()

    if (prof) setProfile(prof)
    if (al) {
      setAluno(al)
      const { data: recordes } = await supabase.from('recordes_pessoais').select('id, peso_kg, exercicio_id, exercicios(nome)').eq('aluno_id', al.id)
      const { data: postsData } = await supabase.from('posts').select('id, foto_url, video_url, tipo, created_at').eq('aluno_id', al.id).order('created_at', { ascending: false })
      const { data: treinosData } = await supabase.from('treinos').select('id, grupo_muscular, data_treino').eq('aluno_id', al.id).order('data_treino', { ascending: false }).limit(10)
      const { count: segCount } = await supabase.from('seguidores').select('*', { count: 'exact', head: true }).eq('seguido_id', al.id)
      const { count: seguCount } = await supabase.from('seguidores').select('*', { count: 'exact', head: true }).eq('seguidor_id', al.id)

      if (recordes) setPrs(recordes as any)
      if (postsData) setPosts(postsData)
      if (treinosData) setTreinos(treinosData)
      setSeguidores(segCount || 0)
      setSeguindo(seguCount || 0)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  async function handleTrocarAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage.from('Avatar').upload(path, file, { upsert: true })
    if (uploadError) return

    const { data: urlData } = supabase.storage.from('Avatar').getPublicUrl(path)
    const fotoUrl = urlData.publicUrl

    await supabase.from('profiles').update({ foto_url: fotoUrl }).eq('id', userId)
    setProfile(prev => prev ? { ...prev, foto_url: fotoUrl } : prev)
  }

  async function handleDeletePost(postId: string) {
    await supabase.from('posts').delete().eq('id', postId)
    setPosts(posts.filter(p => p.id !== postId))
    setSelectedPost(null)
  }

  const iniciais = profile?.nome ? profile.nome.split(" ").map((n: string) => n[0]).join("").toUpperCase() : "?"

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-4">
      {/* Modal foto fullscreen */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 pt-10 pb-4">
            <button onClick={() => setSelectedPost(null)}><X className="h-6 w-6 text-white" /></button>
            <button
              onClick={() => handleDeletePost(selectedPost.id)}
              className="flex items-center gap-2 text-red-400 text-sm"
            >
              <Trash2 className="h-4 w-4" /> Remover
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {selectedPost.video_url ? (
              <video src={selectedPost.video_url} className="w-full h-full object-contain" controls autoPlay />
            ) : (
              <img src={selectedPost.foto_url} alt="post" className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}

      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Perfil</span>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">Sair</button>
        </div>

        <div className="flex items-center gap-4">
          {/* Avatar clicável para trocar */}
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-primary overflow-hidden cursor-pointer" onClick={() => avatarRef.current?.click()}>
              {profile?.foto_url && <AvatarImage src={profile.foto_url} alt={profile.nome} className="object-cover" />}
              <AvatarFallback className="bg-secondary text-foreground text-xl font-bold">{iniciais}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => avatarRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary"
            >
              <Camera className="h-3 w-3 text-primary-foreground" />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleTrocarAvatar} />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{profile?.nome || "Sem nome"}</h2>
            <p className="text-sm text-muted-foreground capitalize">{aluno?.objetivo || ""}</p>
            <div className="mt-1 flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">{aluno?.streak || 0} dias</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{posts.length}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{seguidores}</p>
            <p className="text-xs text-muted-foreground">Seguidores</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{seguindo}</p>
            <p className="text-xs text-muted-foreground">Seguindo</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button onClick={() => onNavigate("evolution")} className="flex items-center justify-between rounded-xl bg-secondary p-3 transition-colors hover:bg-secondary/80">
            <span className="text-sm font-medium text-foreground">Minha Evolução</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <button onClick={() => onNavigate("nutrition")} className="flex items-center justify-between rounded-xl bg-secondary p-3 transition-colors hover:bg-secondary/80">
            <span className="text-sm font-medium text-foreground">Plano Nutricional</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <Tabs defaultValue="photos" className="px-4">
        <TabsList className="w-full bg-secondary">
          <TabsTrigger value="photos" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Grid3X3 className="mr-1 h-4 w-4" /> Fotos
          </TabsTrigger>
          <TabsTrigger value="prs" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Trophy className="mr-1 h-4 w-4" /> PRs
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="mr-1 h-4 w-4" /> Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="mt-4">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Nenhuma foto postada ainda</p>
              <p className="text-xs text-muted-foreground mt-1">Poste seu primeiro treino!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <button key={post.id} onClick={() => setSelectedPost(post)} className="aspect-square rounded-sm overflow-hidden relative">
                  {post.video_url ? (
                    <div className="h-full w-full bg-secondary flex items-center justify-center">
                      <video src={post.video_url} className="h-full w-full object-cover" muted />
                    </div>
                  ) : (
                    <img src={post.foto_url} alt="" className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prs" className="mt-4">
          {prs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Nenhum PR registrado ainda</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {prs.map((pr) => (
                <div key={pr.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">{pr.exercicios?.nome}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{pr.peso_kg}kg</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {treinos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Nenhum treino registrado ainda</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {treinos.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{new Date(t.data_treino).toLocaleDateString('pt-BR')} — {t.grupo_muscular}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
