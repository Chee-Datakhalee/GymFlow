"use client"

import { useState, useEffect } from "react" 
import { Flame, Crown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"

type RankingUser = {
  aluno_id: string
  nome: string
  foto_url: string | null
  total_treinos: number
  total_fogo: number
  profile_id: string
}

export function RankingScreen() {
  const [ranking, setRanking] = useState<RankingUser[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [academiaId, setAcademiaId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRanking() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setCurrentUserId(user.id)

      // Busca academia do aluno logado
      const { data: aluno } = await supabase
        .from('alunos')
        .select('id, academia_id')
        .eq('profile_id', user.id)
        .single()

      if (!aluno?.academia_id) {
        setLoading(false)
        return
      }

      setAcademiaId(aluno.academia_id)

      // Busca todos alunos da academia com profile
      const { data: alunos } = await supabase
        .from('alunos')
        .select('id, profile_id, profiles(nome, foto_url)')
        .eq('academia_id', aluno.academia_id)

      if (!alunos) { setLoading(false); return }


      // Busca treinos da semana por aluno
      const inicioSemana = new Date()
      inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay())
      inicioSemana.setHours(0, 0, 0, 0)

      const { data: treinos } = await supabase
        .from('treinos')
        .select('aluno_id')
        .eq('concluido', true)
        .gte('data_treino', inicioSemana.toISOString())

      // Busca total de fogo por aluno
      const { data: reacoes } = await supabase
        .from('posts')
        .select('aluno_id, total_fogo')
        .eq('academia_id', aluno.academia_id)

      const ranked = alunos.map((a: any) => {
        const totalTreinos = treinos?.filter((t) => t.aluno_id === a.id).length || 0
        const totalFogo = reacoes?.filter((r) => r.aluno_id === a.id)
          .reduce((acc, r) => acc + (r.total_fogo || 0), 0) || 0
        return {
          aluno_id: a.id,
          profile_id: a.profile_id,
          nome: a.profiles?.nome || 'Aluno',
          foto_url: a.profiles?.foto_url || null,
          total_treinos: totalTreinos,
          total_fogo: totalFogo,
        }
      }).sort((a, b) => b.total_treinos - a.total_treinos || b.total_fogo - a.total_fogo)

      setRanking(ranked)
      setLoading(false)
    }
    fetchRanking()
  }, [])

  const currentUserRank = ranking.findIndex((u) => u.profile_id === currentUserId) + 1
  const currentUser = ranking.find((u) => u.profile_id === currentUserId)

  function getIniciais(nome: string) {
    return nome.split(" ").map((n) => n[0]).join("").toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

    if (ranking.length === 0) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-lg font-bold text-foreground">Ranking vazio</p>
        <p className="mt-2 text-sm text-muted-foreground">Seja o primeiro a treinar essa semana!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-4">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-foreground">Ranking da Semana</h2>
        <p className="text-xs text-muted-foreground">Sua Academia</p>
      </div>

      {/* Top 3 Podium */}
      {ranking.length >= 3 && (
        <div className="flex items-end justify-center gap-4 px-4 pt-8 pb-6">
          {/* 2nd */}
          <div className="flex flex-col items-center">
            <Avatar className="h-16 w-16 border-2 border-gray-400">
              {ranking[1]?.foto_url && <AvatarImage src={ranking[1].foto_url} />}
              <AvatarFallback className="bg-secondary text-foreground text-sm font-bold">
                {getIniciais(ranking[1]?.nome || "")}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm font-bold text-background">2</div>
            <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-foreground">{ranking[1]?.nome.split(" ")[0]}</p>
            <p className="text-xs text-muted-foreground">{ranking[1]?.total_treinos}x</p>
          </div>

          {/* 1st */}
          <div className="flex flex-col items-center -mt-4">
            <Crown className="mb-1 h-6 w-6 text-yellow-500" />
            <div className="rounded-full p-[2px] bg-gradient-to-br from-yellow-400 to-yellow-600">
              <Avatar className="h-20 w-20 border-2 border-background">
                {ranking[0]?.foto_url && <AvatarImage src={ranking[0].foto_url} />}
                <AvatarFallback className="bg-secondary text-foreground font-bold">
                  {getIniciais(ranking[0]?.nome || "")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-background">1</div>
            <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-foreground">{ranking[0]?.nome.split(" ")[0]}</p>
            <p className="text-xs text-muted-foreground">{ranking[0]?.total_treinos}x</p>
          </div>

          {/* 3rd */}
          <div className="flex flex-col items-center">
            <Avatar className="h-16 w-16 border-2 border-orange-700">
              {ranking[2]?.foto_url && <AvatarImage src={ranking[2].foto_url} />}
              <AvatarFallback className="bg-secondary text-foreground text-sm font-bold">
                {getIniciais(ranking[2]?.nome || "")}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-700 text-sm font-bold text-foreground">3</div>
            <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-foreground">{ranking[2]?.nome.split(" ")[0]}</p>
            <p className="text-xs text-muted-foreground">{ranking[2]?.total_treinos}x</p>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="flex flex-col gap-2 px-4">
        {ranking.slice(3).map((user, i) => (
          <div key={user.aluno_id} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
            <span className="w-6 text-center text-sm font-bold text-muted-foreground">{i + 4}</span>
            <Avatar className="h-10 w-10">
              {user.foto_url && <AvatarImage src={user.foto_url} />}
              <AvatarFallback className="bg-card text-foreground text-xs font-bold">
                {getIniciais(user.nome)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{user.nome}</p>
              <p className="text-xs text-muted-foreground">{user.total_treinos} treinos</p>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">{user.total_fogo}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Posição do usuário atual */}
      {currentUser && (
        <div className="sticky bottom-20 mx-4 mt-4 rounded-xl border border-primary/30 bg-primary/5 p-3 neon-glow">
          <div className="flex items-center gap-3">
            <span className="w-6 text-center text-sm font-bold text-primary">#{currentUserRank}</span>
            <Avatar className="h-10 w-10 border border-primary">
              {currentUser.foto_url && <AvatarImage src={currentUser.foto_url} />}
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {getIniciais(currentUser.nome)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Você</p>
              <p className="text-xs text-muted-foreground">{currentUser.total_treinos} treinos</p>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">{currentUser.total_fogo}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
