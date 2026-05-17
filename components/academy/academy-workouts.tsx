"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockExercises, muscleGroups } from "@/lib/mock-data"

const mockWorkoutPlans = [
  { id: "1", name: "Treino A — Peito", muscle: "Peito", exercises: mockExercises.filter((e) => e.muscle === "Peito") },
  { id: "2", name: "Treino B — Costas", muscle: "Costas", exercises: mockExercises.filter((e) => e.muscle === "Costas") },
  { id: "3", name: "Treino C — Perna", muscle: "Perna", exercises: mockExercises.filter((e) => e.muscle === "Perna") },
]

export function AcademyWorkouts() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Treinos</h1>
          <p className="text-sm text-muted-foreground">{mockWorkoutPlans.length} treinos cadastrados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground neon-glow hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Criar Treino
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card text-card-foreground max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Novo Treino</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Nome do treino</Label>
                <Input placeholder="Ex: Treino D — Ombro" className="border-border bg-secondary text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Grupo muscular</Label>
                <Select>
                  <SelectTrigger className="border-border bg-secondary text-foreground">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card text-card-foreground">
                    {muscleGroups.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exercises section */}
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Exercicios</Label>
                <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
                  {["Desenvolvimento", "Elevacao Lateral", "Elevacao Frontal"].map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary p-2">
                      <span className="flex-1 text-sm text-foreground">{ex}</span>
                      <Input placeholder="Series" className="h-8 w-16 border-border bg-background text-center text-xs text-foreground" defaultValue="4" />
                      <Input placeholder="Reps" className="h-8 w-16 border-border bg-background text-center text-xs text-foreground" defaultValue="10-12" />
                      <button className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="border-dashed border-border text-muted-foreground">
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar exercicio
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-primary text-primary-foreground neon-glow hover:bg-primary/90"
                >
                  Salvar Treino
                </Button>
                <Button
                  variant="outline"
                  className="border-border text-foreground"
                  onClick={() => setOpen(false)}
                >
                  Atribuir para aluno
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workout Plans */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockWorkoutPlans.map((plan) => (
          <Card key={plan.id} className="border-border bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-foreground">{plan.name}</CardTitle>
                <Badge className="bg-primary/20 text-primary border-0">{plan.muscle}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {plan.exercises.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between rounded-lg bg-secondary p-2 text-sm">
                    <span className="text-foreground">{ex.name}</span>
                    <span className="text-muted-foreground">{ex.sets}x{ex.reps}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
