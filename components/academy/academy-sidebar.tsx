"use client"

import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Trophy,
  DollarSign,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"

const navItems = [
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { key: "students", icon: Users, label: "Alunos" },
  { key: "workouts", icon: Dumbbell, label: "Treinos" },
  { key: "ranking", icon: Trophy, label: "Ranking" },
  { key: "financial", icon: DollarSign, label: "Financeiro" },
  { key: "notifications", icon: Bell, label: "Notificacoes" },
  { key: "settings", icon: Settings, label: "Configuracoes" },
]

export function AcademySidebar({
  active,
  onNavigate,
  onLogout,
}: {
  active: string
  onNavigate: (screen: string) => void
  onLogout: () => void
}) {
  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Dumbbell className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">
          Gym<span className="text-primary">Flow</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = active === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}
