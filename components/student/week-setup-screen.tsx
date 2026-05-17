"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { weekDays, muscleGroups } from "@/lib/mock-data"

export function WeekSetupScreen({ onContinue }: { onContinue: () => void }) {
  const [schedule, setSchedule] = useState<Record<string, { active: boolean; muscle: string }>>({
    seg: { active: true, muscle: "Peito" },
    ter: { active: false, muscle: "" },
    qua: { active: true, muscle: "Costas" },
    qui: { active: false, muscle: "" },
    sex: { active: true, muscle: "Perna" },
    sab: { active: false, muscle: "" },
    dom: { active: false, muscle: "" },
  })

  const toggleDay = (key: string) => {
    setSchedule((prev) => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active },
    }))
  }

  const setMuscle = (key: string, muscle: string) => {
    setSchedule((prev) => ({
      ...prev,
      [key]: { ...prev[key], muscle },
    }))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground">
          Quando voce treina?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Defina seus dias e grupos musculares
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {weekDays.map((day, i) => {
            const config = schedule[day.key]
            return (
              <motion.div
                key={day.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-xl p-4 transition-all ${
                  config.active ? "border-primary neon-glow" : "opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${config.active ? "text-foreground" : "text-muted-foreground"}`}>
                    {day.label}
                  </span>
                  <Switch
                    checked={config.active}
                    onCheckedChange={() => toggleDay(day.key)}
                  />
                </div>
                {config.active && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-3"
                  >
                    <Select value={config.muscle} onValueChange={(v) => setMuscle(day.key, v)}>
                      <SelectTrigger className="border-border bg-secondary text-foreground">
                        <SelectValue placeholder="Grupo muscular" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card text-card-foreground">
                        {muscleGroups.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8">
          <Button
            onClick={() => {
              localStorage.setItem('gymflow_schedule', JSON.stringify(schedule))
              onContinue()
            }}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-lg font-bold text-primary-foreground neon-glow hover:bg-primary/90"
          >
            Continuar
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
