"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Check, Timer, Moon, Dumbbell, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { mockExercises, muscleGroups } from "@/lib/mock-data"
import { supabase } from "@/lib/supabase"

const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"]
const diasNomes: Record<string, string> = {
  dom: "Domingo", seg: "Segunda", ter: "Terça",
  qua: "Quarta", qui: "Quinta", sex: "Sexta", sab: "Sábado"
}

const muscleEmoji: Record<string, string> = {
  'Peito': '💪', 'Costas': '🔙', 'Perna': '🦵', 'Ombro': '🏋️',
  'Biceps': '💪', 'Triceps': '💪', 'Abdomen': '🎯', 'Fullbody': '⚡',
  'Peito + Triceps': '💪', 'Costas + Biceps': '🔙', 'Perna + Ombro': '🦵'
}

function getDiaHoje(): string {
  return diasSemana[new Date().getDay()]
}

export function WorkoutScreen() {
  const diaHoje = getDiaHoje()
  const [muscleHoje, setMuscleHoje] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedSets, setCompletedSets] = useState<Record<string, Record<number, {reps: string, kg: string, done: boolean}>>>({})
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const [isResting, setIsResting] = useState(false)
  const [workoutFinished, setWorkoutFinished] = useState(false)
  const [treinoAvulso, setTreinoAvulso] = useState(false)
  const [muscleAvulso, setMuscleAvulso] = useState<string>("")

  useEffect(() => {
    async function fetchDiaTreino() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: aluno } = await supabase.from('alunos').select('id').eq('profile_id', user.id).single()
      if (!aluno) { setLoading(false); return }
      const { data: dia } = await supabase.from('dias_treino').select('grupo_muscular').eq('aluno_id', aluno.id).eq('dia_semana', diaHoje).single()
      if (dia) setMuscleHoje(dia.grupo_muscular)
      setLoading(false)
    }
    fetchDiaTreino()
  }, [diaHoje])

  const muscleAtivo = treinoAvulso ? muscleAvulso : muscleHoje

  // Filtra exercícios baseado no grupo muscular — suporta combinados (Peito + Triceps)
  const todayExercises = muscleAtivo ? (() => {
    const grupos = muscleAtivo.split(' + ').map(g => g.trim())
    return mockExercises.filter(e => grupos.includes(e.muscle))
  })() : []

  const totalSets = todayExercises.reduce((acc, e) => acc + e.sets, 0)
  const completedTotal = Object.values(completedSets).flatMap(e => Object.values(e)).filter(s => s.done).length
  const progress = totalSets > 0 ? (completedTotal / totalSets) * 100 : 0

  const startRest = useCallback(() => { setRestTimer(60); setIsResting(true) }, [])

  useEffect(() => {
    if (restTimer === null || restTimer <= 0) { if (restTimer === 0) setIsResting(false); return }
    const interval = setInterval(() => setRestTimer(prev => prev !== null ? prev - 1 : null), 1000)
    return () => clearInterval(interval)
  }, [restTimer])

  function updateSet(exerciseId: string, setIndex: number, field: 'reps' | 'kg' | 'done', value: string | boolean) {
    setCompletedSets(prev => {
      const exercise = mockExercises.find(e => e.id === exerciseId)
      const current = prev[exerciseId] || {}
      const currentSet = current[setIndex] || { reps: exercise?.reps.split('-')[0] || '8', kg: '', done: false }
      const updated = { ...currentSet, [field]: value }
      if (field === 'done' && value === true) startRest()
      return { ...prev, [exerciseId]: { ...current, [setIndex]: updated } }
    })
  }

  if (loading) return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )

  // Seleção treino avulso
  if (treinoAvulso && !muscleAvulso) return (
    <div className="flex flex-col px-4 pt-6 pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Treino Avulso</h2>
        <p className="mt-1 text-sm text-muted-foreground">Escolha o grupo muscular</p>
      </div>
      <div className="flex flex-col gap-2">
        {muscleGroups.map((g) => (
          <button key={g} onClick={() => setMuscleAvulso(g)}
            className="flex items-center justify-between rounded-xl bg-secondary p-4 transition-all hover:border-primary/50 hover:bg-secondary/80 border border-border">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{muscleEmoji[g] || '💪'}</span>
              <span className="font-medium text-foreground">{g}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      <Button variant="outline" onClick={() => setTreinoAvulso(false)} className="mt-4 rounded-xl border-border text-foreground">
        Voltar
      </Button>
    </div>
  )

  // Dia de descanso
  if (!muscleAtivo) return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
        <Moon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Dia de Descanso</h2>
      <p className="mt-2 text-muted-foreground">{diasNomes[diaHoje]} não tem treino configurado</p>
      <p className="mt-1 text-sm text-muted-foreground">Descanse e volte mais forte amanhã 💪</p>
      <Button onClick={() => setTreinoAvulso(true)} className="mt-8 rounded-xl bg-primary text-primary-foreground neon-glow">
        Fazer treino avulso
      </Button>
    </div>
  )

  // Treino concluído
  if (workoutFinished) return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary neon-glow">
        <Check className="h-12 w-12 text-primary-foreground" />
      </motion.div>
      <h2 className="text-2xl font-bold text-foreground">Treino Concluído!</h2>
      <p className="mt-2 text-muted-foreground">Você completou {completedTotal} séries hoje 🔥</p>
      <Button onClick={() => { setWorkoutFinished(false); setCompletedSets({}); setTreinoAvulso(false); setMuscleAvulso("") }}
        className="mt-8 rounded-xl bg-primary text-primary-foreground neon-glow">
        Novo Treino
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{muscleEmoji[muscleAtivo] || '💪'}</span>
              <h2 className="text-base font-bold text-foreground">
                {treinoAvulso ? "Avulso" : diasNomes[diaHoje]} — {muscleAtivo}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {todayExercises.length} exercícios · {totalSets} séries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
            {!treinoAvulso && (
              <button onClick={() => window.dispatchEvent(new CustomEvent('editarTreino'))}
                className="text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-2 py-1">
                Editar
              </button>
            )}
            {treinoAvulso && (
              <button onClick={() => { setMuscleAvulso(""); setCompletedSets({}) }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-2 py-1">
                Trocar
              </button>
            )}
          </div>
        </div>
        <Progress value={progress} className="mt-2 h-1.5 bg-secondary [&>div]:bg-primary" />
      </div>

      {/* Timer de descanso */}
      {isResting && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
          className="mx-4 mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-center neon-glow">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Timer className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Descanso</span>
          </div>
          <div className="text-3xl font-bold text-primary">0:{restTimer?.toString().padStart(2, "0")}</div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Button size="sm" variant="outline" onClick={() => { setRestTimer(null); setIsResting(false) }} className="border-border text-foreground h-8 text-xs">
              <RotateCcw className="mr-1 h-3 w-3" /> Pular
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsResting(!isResting)} className="border-border text-foreground h-8 text-xs">
              {isResting ? <Pause className="mr-1 h-3 w-3" /> : <Play className="mr-1 h-3 w-3" />}
              {isResting ? "Pausar" : "Retomar"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Exercícios */}
      <div className="mt-3 flex flex-col gap-3 px-4">
        {todayExercises.map((exercise, i) => (
          <motion.div key={exercise.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="glass rounded-xl overflow-hidden">
            {/* Vídeo placeholder */}
            <div className="relative bg-secondary" style={{paddingBottom:'42%'}}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/50">
                  <Play className="h-5 w-5" />
                </div>
                <span className="text-xs">Vídeo do exercício</span>
              </div>
            </div>

            <div className="p-4">
              {/* Info do exercício */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">{exercise.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{exercise.sets} séries</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{exercise.reps} reps</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{exercise.muscle}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{String(i + 1).padStart(2, '0')}</span>
              </div>

              {/* Header das colunas */}
              <div className="grid grid-cols-[40px_1fr_1fr_32px] gap-2 mb-1 px-1">
                <span className="text-xs text-muted-foreground"></span>
                <span className="text-xs text-muted-foreground text-center">Reps</span>
                <span className="text-xs text-muted-foreground text-center">Kg</span>
                <span></span>
              </div>

              {/* Séries */}
              <div className="flex flex-col gap-1.5">
                {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                  const setData = completedSets[exercise.id]?.[setIndex]
                  const isComplete = setData?.done || false
                  return (
                    <div key={setIndex} className={`grid grid-cols-[40px_1fr_1fr_32px] gap-2 items-center rounded-lg px-1 py-1.5 transition-colors ${isComplete ? "bg-primary/10" : "bg-secondary/50"}`}>
                      <span className="text-xs font-medium text-muted-foreground text-center">S{setIndex + 1}</span>
                      <Input
                        type="number"
                        placeholder={exercise.reps.split("-")[0]}
                        value={setData?.reps || ''}
                        onChange={e => updateSet(exercise.id, setIndex, 'reps', e.target.value)}
                        className="h-8 border-border bg-background text-center text-sm text-foreground"
                      />
                      <Input
                        type="number"
                        placeholder="0"
                        value={setData?.kg || ''}
                        onChange={e => updateSet(exercise.id, setIndex, 'kg', e.target.value)}
                        className="h-8 border-border bg-background text-center text-sm text-foreground"
                      />
                      <Checkbox
                        checked={isComplete}
                        onCheckedChange={v => updateSet(exercise.id, setIndex, 'done', v as boolean)}
                        className="h-6 w-6 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary mx-auto"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botão finalizar */}
      {progress > 50 && (
        <div className="px-4 pt-4">
          <Button onClick={() => setWorkoutFinished(true)} className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground neon-glow hover:bg-primary/90">
            Finalizar Treino 🏁
          </Button>
        </div>
      )}
    </div>
  )
}
