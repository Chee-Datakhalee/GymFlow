"use client"

import { useState } from "react"
import { Flame, Trophy, Award, ChevronRight, Grid3X3, List, Clock } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockUsers, mockExercises } from "@/lib/mock-data"

const user = mockUsers[0]

export function ProfileScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarFallback className="bg-secondary text-foreground text-xl font-bold">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <div className="mt-1 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">{user.streak} dias</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">#{user.position}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{user.weeklyWorkouts}</p>
            <p className="text-xs text-muted-foreground">Treinos/sem</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{user.fires}</p>
            <p className="text-xs text-muted-foreground">Total 🔥</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">PRs</p>
          </div>
        </div>

        {/* Navigation links */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => onNavigate("evolution")}
            className="flex items-center justify-between rounded-xl bg-secondary p-3 transition-colors hover:bg-secondary/80"
          >
            <span className="text-sm font-medium text-foreground">Minha Evolucao</span>
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

      {/* Tabs */}
      <Tabs defaultValue="photos" className="px-4">
        <TabsList className="w-full bg-secondary">
          <TabsTrigger value="photos" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Grid3X3 className="mr-1 h-4 w-4" />
            Fotos
          </TabsTrigger>
          <TabsTrigger value="prs" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Trophy className="mr-1 h-4 w-4" />
            PRs
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="mr-1 h-4 w-4" />
            Historico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="mt-4">
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square bg-secondary rounded-sm flex items-center justify-center">
                <span className="text-xs text-muted-foreground">{i + 1}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prs" className="mt-4">
          <div className="flex flex-col gap-2">
            {mockExercises.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">{e.name}</span>
                </div>
                <span className="text-sm font-bold text-primary">{e.pr}kg</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="flex flex-col gap-2">
            {["16/05 — Peito — 4200kg", "15/05 — Costas — 3800kg", "14/05 — Perna — 5200kg", "12/05 — Ombro — 2400kg", "11/05 — Peito — 4100kg"].map((entry, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{entry}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
