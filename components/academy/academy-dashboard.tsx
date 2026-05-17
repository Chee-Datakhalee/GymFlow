"use client"

import { Users, Activity, UserX, AlertTriangle, MessageCircle, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockUsers, mockWeeklyFrequency } from "@/lib/mock-data"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const stats = [
  { label: "Total de Alunos", value: "127", icon: Users, color: "text-primary" },
  { label: "Ativos Hoje", value: "45", icon: Activity, color: "text-primary" },
  { label: "Inativos +7 dias", value: "18", icon: UserX, color: "text-yellow-500" },
  { label: "Inadimplentes", value: "8", icon: AlertTriangle, color: "text-destructive" },
]

const topActive = mockUsers.filter((u) => u.status === "ativo").sort((a, b) => b.weeklyWorkouts - a.weeklyWorkouts).slice(0, 5)
const topInactive = mockUsers.filter((u) => u.status === "inativo").slice(0, 5)

export function AcademyDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visao geral da sua academia</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-secondary ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Frequency Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Frequencia - Ultimos 7 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklyFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                />
                <Bar dataKey="count" fill="#00FF87" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Most Active */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Flame className="h-5 w-5 text-primary" />
              Mais Ativos da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {topActive.map((user, i) => (
                <div key={user.id} className="flex items-center gap-3">
                  <span className="w-6 text-center text-sm font-bold text-muted-foreground">{i + 1}</span>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.weeklyWorkouts} treinos</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-primary">{user.fires}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inactive */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <UserX className="h-5 w-5 text-yellow-500" />
              Inativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {topInactive.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">Ultimo treino: {new Date(user.lastWorkout).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
