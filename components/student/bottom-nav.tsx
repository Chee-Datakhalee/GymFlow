"use client"

import { Home, Dumbbell, Plus, Trophy, User } from "lucide-react"

const navItems = [
  { key: "feed", icon: Home, label: "Feed" },
  { key: "workout", icon: Dumbbell, label: "Treino" },
  { key: "post", icon: Plus, label: "Postar" },
  { key: "ranking", icon: Trophy, label: "Ranking" },
  { key: "profile", icon: User, label: "Perfil" },
]

export function BottomNav({
  active,
  onNavigate,
  onPost,
}: {
  active: string
  onNavigate: (screen: string) => void
  onPost: () => void
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[430px] items-center justify-around py-2">
        {navItems.map((item) => {
          const isPost = item.key === "post"
          const isActive = active === item.key

          if (isPost) {
            return (
              <button
                key={item.key}
                onClick={onPost}
                className="flex -mt-4 h-14 w-14 items-center justify-center rounded-full bg-primary neon-glow transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="h-7 w-7 text-primary-foreground" />
              </button>
            )
          }

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
