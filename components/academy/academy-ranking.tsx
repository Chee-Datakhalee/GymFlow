"use client"

import { Crown, Flame, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockUsers } from "@/lib/mock-data"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const ranked = [...mockUsers].sort((a, b) => b.weeklyWorkouts - a.weeklyWorkouts).slice(0, 10)
const king = ranked[0]

const engagementData = [
  { month: "Out", rate: 62 },
  { month: "Nov", rate: 68 },
  { month: "Dez", rate: 55 },
  { month: "Jan", rate: 72 },
  { month: "Fev", rate: 75 },
  { month: "Mar", rate: 78 },
  { month: "Abr", rate: 82 },
  { month: "Mai", rate: 85 },
]

export function AcademyRanking() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ranking</h1>
        <p className="text-sm text-muted-foreground">Top alunos da semana</p>
      </div>

      {/* King of the week */}
      <Card className="border-primary/30 bg-card neon-glow overflow-hidden">
        <CardContent className="flex items-center gap-6 p-6">
          <div className="relative">
            <Crown className="absolute -top-3 left-1/2 -translate-x-1/2 h-8 w-8 text-yellow-500" />
            <Avatar className="h-24 w-24 border-2 border-yellow-500">
              <AvatarFallback className="bg-secondary text-foreground text-2xl font-bold">
                {king.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Rei da Semana</p>
            <h2 className="text-2xl font-bold text-foreground">{king.name}</h2>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Flame className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold text-primary">{king.weeklyWorkouts} treinos</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{king.fires} reacoes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top 10 */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Top 10 — Frequencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {ranked.map((user, i) => (
                <div key={user.id} className="flex items-center gap-3">
                  <span className={`w-6 text-center text-sm font-bold ${
                    i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-700" : "text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                  </div>
                  <span className="text-sm text-foreground">{user.weeklyWorkouts}x</span>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary">{user.fires}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Engajamento Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#00FF87"
                    strokeWidth={3}
                    dot={{ fill: "#00FF87", strokeWidth: 0, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
