"use client"

import { useState } from "react"
import { Search, Flame, Trophy, MessageCircle, X, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { mockUsers, mockExercises } from "@/lib/mock-data"

type FilterType = "all" | "ativo" | "inativo" | "inadimplente"

const statusMap = {
  ativo: { label: "Ativo", className: "bg-primary/20 text-primary border-0" },
  inativo: { label: "Inativo", className: "bg-yellow-500/20 text-yellow-500 border-0" },
  inadimplente: { label: "Inadimplente", className: "bg-destructive/20 text-destructive border-0" },
}

export function AcademyStudents() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null)

  const filtered = mockUsers
    .filter((u) => filter === "all" || u.status === filter || (filter === "inadimplente" && u.paymentStatus === "atrasado"))
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "ativo", label: "Ativos" },
    { key: "inativo", label: "Inativos" },
    { key: "inadimplente", label: "Inadimplentes" },
  ]

  // Contribution grid for profile
  const contributions = Array.from({ length: 30 }, () => Math.random() > 0.4)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alunos</h1>
        <p className="text-sm text-muted-foreground">{mockUsers.length} alunos cadastrados</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar aluno..."
            className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              onClick={() => setFilter(f.key)}
              className={filter === f.key
                ? "bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
              }
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Aluno</TableHead>
              <TableHead className="text-muted-foreground">Plano</TableHead>
              <TableHead className="text-muted-foreground">Vencimento</TableHead>
              <TableHead className="text-muted-foreground">Ultimo Treino</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => {
              const status = user.paymentStatus === "atrasado" ? "inadimplente" : user.status
              return (
                <TableRow key={user.id} className="border-border hover:bg-secondary/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{user.plan}</TableCell>
                  <TableCell className="text-foreground">{new Date(user.dueDate).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="text-foreground">{new Date(user.lastWorkout).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge className={statusMap[status]?.className || statusMap.ativo.className}>
                      {statusMap[status]?.label || "Ativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUser(user)}
                      className="border-border text-foreground hover:border-primary hover:text-primary"
                    >
                      Ver perfil
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Student Profile Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <SheetContent className="border-border bg-card text-card-foreground w-[400px] overflow-y-auto">
          {selectedUser && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarFallback className="bg-secondary text-foreground text-lg font-bold">
                      {selectedUser.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-foreground">{selectedUser.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selectedUser.plan} — {selectedUser.goal}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-4">
                {/* Streak */}
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                  <Flame className="h-5 w-5 text-primary" />
                  <span className="font-bold text-primary">{selectedUser.streak} dias de streak</span>
                </div>

                {/* Frequency */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Frequencia Mensal</h4>
                  <div className="flex flex-wrap gap-1">
                    {contributions.map((trained, i) => (
                      <div
                        key={i}
                        className={`h-3 w-3 rounded-sm ${trained ? "bg-primary" : "bg-secondary"}`}
                      />
                    ))}
                  </div>
                </div>

                {/* PRs */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-foreground">PRs</h4>
                  <div className="flex flex-col gap-2">
                    {mockExercises.slice(0, 4).map((e) => (
                      <div key={e.id} className="flex items-center justify-between rounded-lg bg-secondary p-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-foreground">{e.name}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">{e.pr}kg</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent workouts */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Treinos Recentes</h4>
                  <div className="flex flex-col gap-2">
                    {["Peito — 16/05", "Costas — 15/05", "Perna — 14/05"].map((w) => (
                      <div key={w} className="flex items-center gap-2 rounded-lg bg-secondary p-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp */}
                <Button className="mt-2 bg-primary text-primary-foreground neon-glow hover:bg-primary/90">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Alertar no WhatsApp
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
