"use client"

import { useState, useEffect } from "react"
import { Flame, Trophy, Clock, Grid3X3, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"

type Profile = {
  nome: string
  foto_url: string | null
}

type Aluno = {
  id: string
  streak: number
  objetivo: string
}

type PR = {
  id: string
  peso_kg: number
  exercicio_id: string
  exercicios: { nome: string }
}

export function ProfileScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [prs, setPrs] = useState<PR[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [treinos, setTreinos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: prof } = await supabase
        .from('profiles')
        .select('nome, foto_url')
        .eq('id', user.id)
        .single()

      const { data: al } = await supabase
        .from('alunos')
        .select('id, streak, objetivo')
        .eq('profile_id', user.id)
        .single()

      if (prof) setProfile(prof)
      if (al) {
        setAluno(al)

        const { data: recordes } = await supabase
          .from('recordes_pessoais')
          .select('id, peso_kg, exercicio_id, exercicios(nome)')
          .eq('aluno_id', al.id)

        const { data: postsData } = await supabase
          .from('posts')
          .select('id, foto_url, created_at')
          .eq('aluno_id', al.id)
          .order('created_at', { ascending: false })

        const { data: treinosData } = await supabase
          .from('treinos')
          .select('id, grupo_muscular, data_treino')
          .eq('aluno_id', al.id)
          .order('data_treino', { ascending: false })
          .limit(10)

        if (recordes) setPrs(recordes as any)
        if (postsData) setPosts(postsData)
        if (treinosData) setTreinos(treinosData)
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const iniciais = profile?.nome
    ? profile.nome.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "?"

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-4">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Perfil</span>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Sair
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            {profile?.foto_url && <AvatarImage src={profile.foto_url} alt={profile.nome} />}
            <AvatarFallback className="bg-secondary text-foreground text-xl font-bold">
              {iniciais}
            </AvatarFallback>
          </Avatar>
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
            <p className="text-lg font-bold text-foreground">{treinos.length}</p>
            <p className="text-xs text-muted-foreground">Treinos</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{posts.length}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{prs.length}</p>
            <p className="text-xs text-muted-foreground">PRs</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => onNavigate("evolution")}
            className="flex items-center justify-between rounded-xl bg-secondary p-3 transition-colors hover:bg-secondary/80"
          >
            <span className="text-sm font-medium text-foreground">Minha Evolução</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => onNavigate("nutrition")}
            className="flex items-center justify-between rounded-xl bg-secondary p-3 transition-colors hover:bg-secondary/80"
          >
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
                <div key={post.id} className="aspect-square rounded-sm overflow-hidden">
                  <img src={post.foto_url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prs" className="mt-4">
          {prs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Nenhum PR registrado ainda</p>
              <p className="text-xs text-muted-foreground mt-1">Complete treinos para registrar recordes!</p>
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
                  <span className="text-sm text-foreground">
                    {new Date(t.data_treino).toLocaleDateString('pt-BR')} — {t.grupo_muscular}
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
