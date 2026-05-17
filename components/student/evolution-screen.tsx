"use client"

import { ArrowLeft, Trophy, TrendingUp, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockExercises, mockProgressionData } from "@/lib/mock-data"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

export function EvolutionScreen({ onBack }: { onBack: () => void }) {
  // Generate GitHub-style contribution grid
  const contributions = Array.from({ length: 90 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (89 - i))
    const trained = Math.random() > 0.35
    return { date, trained }
  })

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={onBack}>
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <h2 className="text-lg font-bold text-foreground">Sua Evolucao</h2>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Exercise selector */}
        <Select defaultValue="Supino Reto">
          <SelectTrigger className="border-border bg-secondary text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-border bg-card text-card-foreground">
            {mockExercises.map((e) => (
              <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Progression Chart */}
        <div className="mt-4 glass rounded-xl p-4">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Progressao de Carga</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockProgressionData}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FF87" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00FF87" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} unit="kg" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                  labelStyle={{ color: "#888" }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#00FF87"
                  strokeWidth={2}
                  fill="url(#greenGrad)"
                  dot={{ fill: "#00FF87", strokeWidth: 0, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-3 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-lg font-bold text-foreground">65kg</p>
            <p className="text-xs text-muted-foreground">Maior carga</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <Calendar className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-lg font-bold text-foreground">24</p>
            <p className="text-xs text-muted-foreground">Treinos</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-lg font-bold text-foreground">+8kg</p>
            <p className="text-xs text-muted-foreground">No mes</p>
          </div>
        </div>

        {/* PRs */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Seus PRs</h3>
          <div className="flex flex-col gap-2">
            {mockExercises.slice(0, 6).map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">{e.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary">{e.pr}kg</span>
                  <p className="text-xs text-muted-foreground">12/05</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub-style Contribution Calendar */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Calendario de Treinos</h3>
          <div className="glass rounded-xl p-4">
            <div className="flex flex-wrap gap-1">
              {contributions.map((c, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-sm ${
                    c.trained ? "bg-primary" : "bg-secondary"
                  }`}
                  title={c.date.toLocaleDateString("pt-BR")}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-lg font-bold text-foreground">12 dias seguidos</span>
            </div>
          </div>
        </div>

        {/* AI Report */}
        <div className="mt-6 glass rounded-xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm bg-background/60 z-10 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Relatorio do Mes</p>
              <p className="text-xs text-muted-foreground mt-1">Gerado por IA — disponivel todo dia 1</p>
            </div>
          </div>
          <div className="opacity-30">
            <p className="text-sm text-foreground">Voce teve um otimo desempenho este mes...</p>
            <p className="text-xs text-muted-foreground mt-2">Evolucao de 12% na carga total</p>
          </div>
        </div>
      </div>
    </div>
  )
}
