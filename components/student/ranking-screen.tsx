"use client"

import { Flame, Crown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockUsers } from "@/lib/mock-data"

const ranked = [...mockUsers].sort((a, b) => b.weeklyWorkouts - a.weeklyWorkouts)
const currentUser = mockUsers[0] // Simulated current user

export function RankingScreen() {
  const currentUserRank = ranked.findIndex((u) => u.id === currentUser.id) + 1

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-foreground">Ranking da Semana</h2>
        <p className="text-xs text-muted-foreground">Sua Academia</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 px-4 pt-8 pb-6">
        {/* 2nd place */}
        <div className="flex flex-col items-center">
          <Avatar className="h-16 w-16 border-2 border-gray-400">
            <AvatarFallback className="bg-secondary text-foreground text-sm font-bold">
              {ranked[1]?.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm font-bold text-background">
            2
          </div>
          <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-foreground">{ranked[1]?.name.split(" ")[0]}</p>
          <p className="text-xs text-muted-foreground">{ranked[1]?.weeklyWorkouts}x</p>
        </div>

        {/* 1st place */}
        <div className="flex flex-col items-center -mt-4">
          <Crown className="mb-1 h-6 w-6 text-yellow-500" />
          <div className="rounded-full p-[2px] bg-gradient-to-br from-yellow-400 to-yellow-600">
            <Avatar className="h-20 w-20 border-2 border-background">
              <AvatarFallback className="bg-secondary text-foreground font-bold">
                {ranked[0]?.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-background">
            1
          </div>
          <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-foreground">{ranked[0]?.name.split(" ")[0]}</p>
          <p className="text-xs text-muted-foreground">{ranked[0]?.weeklyWorkouts}x</p>
        </div>

        {/* 3rd place */}
        <div className="flex flex-col items-center">
          <Avatar className="h-16 w-16 border-2 border-orange-700">
            <AvatarFallback className="bg-secondary text-foreground text-sm font-bold">
              {ranked[2]?.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-700 text-sm font-bold text-foreground">
            3
          </div>
          <p className="mt-1 max-w-[80px] truncate text-xs font-medium text-foreground">{ranked[2]?.name.split(" ")[0]}</p>
          <p className="text-xs text-muted-foreground">{ranked[2]?.weeklyWorkouts}x</p>
        </div>
      </div>

      {/* Full ranking list */}
      <div className="flex flex-col gap-2 px-4">
        {ranked.slice(3).map((user, i) => (
          <div
            key={user.id}
            className="flex items-center gap-3 rounded-xl bg-secondary p-3"
          >
            <span className="w-6 text-center text-sm font-bold text-muted-foreground">{i + 4}</span>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-card text-foreground text-xs font-bold">
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

      {/* Current user position fixed */}
      <div className="sticky bottom-20 mx-4 mt-4 rounded-xl border border-primary/30 bg-primary/5 p-3 neon-glow">
        <div className="flex items-center gap-3">
          <span className="w-6 text-center text-sm font-bold text-primary">#{currentUserRank}</span>
          <Avatar className="h-10 w-10 border border-primary">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {currentUser.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-primary">Voce</p>
            <p className="text-xs text-muted-foreground">{currentUser.weeklyWorkouts} treinos</p>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary">{currentUser.fires}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
