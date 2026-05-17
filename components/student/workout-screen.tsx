"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Check, Timer, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { mockExercises } from "@/lib/mock-data"

const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"]
const diasNomes: Record<string, string> = {
  dom: "Domingo", seg: "Segunda", ter: "Terça",
  qua: "Quarta", qui: "Quinta", sex: "Sexta", sab: "Sábado"
}

function getDiaHoje(): string {
  return diasSemana[new Date().getDay()]
}

function getMuscleHoje(): string | null {
  try {
    const raw = localStorage.getItem('gymflow_schedule')
    if (!raw) return null
    const schedule = JSON.parse(raw)
    const hoje = getDiaHoje()
    if (schedule[hoje]?.active) return schedule[hoje].muscle
    return null
  } catch {
    return null
  }
}

export function WorkoutScreen() {
  const diaHoje = getDiaHoje()
  const muscleHoje = getMuscleHoje()
  const todayExercises = muscleHoje
    ? mockExercises.filter((e) => e.muscle === muscleHoje.split(' + ')[0])
    : []

  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({})
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const [isResting, setIsResting] = useState(false)
  const [workoutFinished, setWorkoutFinished] = useState(false)

  const totalSets = todayExercises.reduce((acc, e) => acc + e.sets, 0)
  const completedTotal = Object.values(completedSets).flat().filter(Boolean).length
  const progress = totalSets > 0 ? (completedTotal / totalSets) * 100 : 0

  const startRest = useCallback(() => {
    setRestTimer(60)
    setIsResting(true)
  }, [])

  useEffect(() => {
    if (restTimer === null || restTimer <= 0) {
      if (restTimer === 0) setIsResting(false)
      return
    }
    const interval = setInterval(() => {
      setRestTimer((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)
    return () => clearInterval(interval)
  }, [restTimer])

  const toggleSet = (exerciseId: string, setIndex: number) => {
    setCompletedSets((prev) => {
      const exercise = mockExercises.find((e) => e.id === exerciseId)
      const sets = prev[exerciseId] || new Array(exercise?.sets || 4).fill(false)
      const newSets = [...sets]
      newSets[setIndex] = !newSets[setIndex]
      if (newSets[setIndex]) startRest()
      return { ...prev, [exerciseId]: newSets }
    })
  }

  // Dia de descanso
  if (!muscleHoje) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
          <Moon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Dia de Descanso</h2>
        <p className="mt-2 text-muted-foreground">
          {diasNomes[diaHoje]} não tem treino configurado
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Descanse e volte mais forte amanhã 💪
        </p>
        <Button
          onClick={() => {}}
          variant="outline"
          className="mt-8 rounded-xl border-border text-foreground"
        >
          Fazer treino avulso
        </Button>
      </div>
    )
  }

  // Treino concluído
  if (workoutFinished) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary neon-glow"
        >
          <Check className="h-12 w-12 text-primary-foreground" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">Treino Concluído!</h2>
        <p className="mt-2 text-muted-foreground">Você completou {completedTotal} séries hoje</p>
        <Button
          onClick={() => { setWorkoutFinished(false); setCompletedSets({}) }}
          className="mt-8 rounded-xl bg-primary text-primary-foreground neon-glow"
        >
          Novo Treino
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {diasNomes[diaHoje]} — {muscleHoje}
            </h2>
            <p className="text-xs text-muted-foreground">
              Exercício {Math.min(Math.floor(completedTotal / 4) + 1, todayExercises.length)} de {todayExercises.length}
            </p>
          </div>
          <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="mt-2 h-2 bg-secondary [&>div]:bg-primary" />
      </div>

      {/* Rest Timer */}
      {isResting && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mx-4 mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-center neon-glow"
        >
          <div className="flex items-center justify-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Descanso</span>
          </div>
          <div className="mt-2 text-4xl font-bold text-primary">
            0:{restTimer?.toString().padStart(2, "0")}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Button size="sm" variant="outline" onClick={() => { setRestTimer(null); setIsResting(false) }} className="border-border text-foreground">
              <RotateCcw className="mr-1 h-4 w-4" /> Pular
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsResting(!isResting)} className="border-border text-foreground">
              {isResting ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}
              {isResting ? "Pausar" : "Retomar"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Exercises */}
      <div className="mt-4 flex flex-col gap-4 px-4">
        {todayExercises.map((exercise, i) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4"
          >
            <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg bg-secondary">
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Play className="h-8 w-8" />
                  <span className="text-xs">Vídeo do exercício</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-foreground">{exercise.name}</h3>
            <p className="text-xs text-muted-foreground">{exercise.sets} séries x {exercise.reps} reps</p>

            <div className="mt-3 flex flex-col gap-2">
              {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                const isComplete = completedSets[exercise.id]?.[setIndex] || false
                return (
                  <div key={setIndex} className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${isComplete ? "bg-primary/10" : "bg-secondary"}`}>
                    <span className="w-16 text-xs font-medium text-muted-foreground">Série {setIndex + 1}</span>
                    <Input type="number" placeholder="Reps" className="h-8 w-16 border-border bg-background text-center text-sm text-foreground" defaultValue={exercise.reps.split("-")[0]} />
                    <Input type="number" placeholder="Kg" className="h-8 w-16 border-border bg-background text-center text-sm text-foreground" />
                    <Checkbox checked={isComplete} onCheckedChange={() => toggleSet(exercise.id, setIndex)} className="h-6 w-6 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary" />
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {progress > 50 && (
        <div className="px-4 pt-6">
          <Button onClick={() => setWorkoutFinished(true)} className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground neon-glow hover:bg-primary/90">
            Finalizar Treino
          </Button>
        </div>
      )}
    </div>
  )
}
