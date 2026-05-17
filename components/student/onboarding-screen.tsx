"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, User, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const goals = ["Hipertrofia", "Emagrecimento", "Condicionamento"]

export function OnboardingScreen({
  step,
  onNext,
  onSwitchToAcademy,
}: {
  step: number
  onNext: () => void
  onSwitchToAcademy: () => void
}) {
  const [name, setName] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [selectedGoal, setSelectedGoal] = useState("")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col px-6 py-8">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Gym<span className="text-primary">Flow</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === 1 && "Vamos comecar com seu perfil"}
            {step === 2 && "Conte mais sobre voce"}
            {step === 3 && "Qual seu objetivo?"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            {step === 1 && (
              <div className="flex flex-col gap-6">
                {/* Avatar */}
                <button className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-secondary transition-colors hover:border-primary">
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="h-6 w-6 text-primary" />
                    <span className="text-xs text-muted-foreground">Foto</span>
                  </div>
                </button>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-muted-foreground">Nome completo</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="weight" className="text-muted-foreground">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="80"
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="height" className="text-muted-foreground">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="178"
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setSelectedGoal(goal)}
                    className={`glass flex items-center justify-between rounded-xl p-4 transition-all ${
                      selectedGoal === goal
                        ? "border-primary neon-glow"
                        : "border-transparent hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        selectedGoal === goal ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}>
                        <User className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-foreground">{goal}</span>
                    </div>
                    <ChevronRight className={`h-5 w-5 ${
                      selectedGoal === goal ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            onClick={onNext}
            className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground neon-glow hover:bg-primary/90"
          >
            {step === 3 ? "Comecar" : "Continuar"}
          </Button>
          <button
            onClick={onSwitchToAcademy}
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Sou academia
          </button>
        </div>
      </div>
    </div>
  )
}
