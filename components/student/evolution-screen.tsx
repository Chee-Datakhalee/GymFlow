"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Trophy, TrendingUp, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { supabase } from "@/lib/supabase"

export function EvolutionScreen({ onBack }: { onBack: () => void }) {
  const [exercicios, setExercicios] = useState<any[]>([])
  const [selectedExercicio, setSelectedExercicio] = useState<string | null>(null)
  const [progressao, setProgressao] = useState<any[]>([])
  const [prs, setPrs] = useState<any[]>([])
  const [treinos, setTreinos] = useState<any[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [alunoId, setAlunoId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: aluno } = await supabase
        .from('alunos')
        .select('id, streak')
        .eq('profile_id', user.id)
        .single()

      if (!aluno) return
      setAlunoId(aluno.id)
      setStreak(aluno.streak || 0)

      // Busca PRs com exercício
      const { data: recordes } = await supabase
        .from('recordes_pessoais')
        .select('id, peso_kg, data_recorde, exercicio_id, exercicios(id, nome, grupo_muscular)')
        .eq('aluno_id', aluno.id)

      if (recordes) {
        setPrs(recordes)
        const exs = recordes.map((r: any) => r.exercicios).filter(Boolean)
        setExercicios(exs)
        if (exs.length > 0) {
          setSelectedExercicio(exs[0].id)
        }
      }

      // Busca treinos
      const { data: treinosData } = await supabase
        .from('treinos')
        .select('id, data_treino, grupo_muscular, concluido')
        .eq('aluno_id', aluno.id)
        .order('data_treino', { ascending: false })

      if (treinosData) setTreinos(treinosData)

      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!selectedExercicio || !alunoId) return
    fetchProgressao()
  }, [selectedExercicio, alunoId])

  async function fetchProgressao() {
    if (!alunoId || !selectedExercicio) return

    const { data } = await supabase
      .from('series_registradas')
      .select('peso_kg, created_at, treinos(data_treino)')
      .eq('treinos.aluno_id', alunoId)
      .eq('exercicio_id', selectedExercicio)
      .order('created_at', { ascending: true })

    if (data && data.length > 0) {
      const grouped: Record<string, number> = {}
      data.forEach((s: any) => {
        const date = s.treinos?.data_treino || s.created_at?.split('T')[0]
        if (date && s.peso_kg) {
          if (!grouped[date] || s.peso_kg > grouped[date]) {
            grouped[date] = s.peso_kg
          }
        }
      })
      const chart = Object.entries(grouped).map(([date, peso]) => ({
        semana: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        peso
      }))
      setProgressao(chart)
    } else {
      setProgressao([])
    }
  }

  // Calendário de treinos — últimos 90 dias
  const contributions = Array.from({ length: 90 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (89 - i))
    const dateStr = date.toISOString().split('T')[0]
    const trained = treinos.some(t => t.data_treino === dateStr && t.concluido)
    return { date, trained }
  })

  const maiorCarga = prs.length > 0 ? Math.max(...prs.map(p => p.peso_kg)) : 0
  const evolucaoMes = progressao.length >= 2
    ? (progressao[progressao.length - 1].peso - progressao[0].peso).toFixed(1)
    : null

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-4">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={onBack}>
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <h2 className="text-lg font-bold text-foreground">Sua Evolução</h2>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Seletor de exercício */}
        {exercicios.length > 0 ? (
          <>
            <Select
              value={selectedExercicio || ""}
              onValueChange={setSelectedExercicio}
            >
              <SelectTrigger className="border-border bg-secondary text-foreground">
                <SelectValue placeholder="Selecione um exercício" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-card-foreground">
                {exercicios.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Gráfico */}
            <div className="mt-4 glass rounded-xl p-4">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Progressão de Carga</h3>
              {progressao.length === 0 ? (
                <div className="flex h-52 items-center justify-center">
                  <p className="text-sm text-muted-foreground">Nenhum dado registrado ainda</p>
                </div>
              ) : (
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressao}>
                      <defs>
                        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00FF87" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#00FF87" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="semana" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} unit="kg" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                        labelStyle={{ color: "#888" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="peso"
                        stroke="#00FF87"
                        strokeWidth={2}
                        fill="url(#greenGrad)"
                        dot={{ fill: "#00FF87", strokeWidth: 0, r: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="glass rounded-xl p-6 text-center">
            <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">Nenhum PR registrado ainda</p>
            <p className="text-xs text-muted-foreground mt-1">Complete treinos para ver sua evolução</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-3 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-lg font-bold text-foreground">{maiorCarga > 0 ? `${maiorCarga}kg` : '—'}</p>
            <p className="text-xs text-muted-foreground">Maior carga</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <Calendar className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-lg font-bold text-foreground">{treinos.length}</p>
            <p className="text-xs text-muted-foreground">Treinos</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-lg font-bold text-foreground">{evolucaoMes ? `+${evolucaoMes}kg` : '—'}</p>
            <p className="text-xs text-muted-foreground">Evolução</p>
          </div>
        </div>

        {/* PRs */}
        {prs.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Seus PRs</h3>
            <div className="flex flex-col gap-2">
              {prs.map((pr) => (
                <div key={pr.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">{pr.exercicios?.nome}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-primary">{pr.peso_kg}kg</span>
                    <p className="text-xs text-muted-foreground">
                      {pr.data_recorde ? new Date(pr.data_recorde).toLocaleDateString('pt-BR') : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendário */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Calendário de Treinos</h3>
          <div className="glass rounded-xl p-4">
            <div className="flex flex-wrap gap-1">
              {contributions.map((c, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-sm ${c.trained ? "bg-primary" : "bg-secondary"}`}
                  title={c.date.toLocaleDateString("pt-BR")}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-lg font-bold text-foreground">{streak} dias seguidos</span>
            </div>
          </div>
        </div>

        {/* Relatório IA */}
        <div className="mt-6 glass rounded-xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm bg-background/60 z-10 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Relatório do Mês</p>
              <p className="text-xs text-muted-foreground mt-1">Gerado por IA — disponível todo dia 1</p>
            </div>
          </div>
          <div className="opacity-30">
            <p className="text-sm text-foreground">Você teve um ótimo desempenho este mês...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
