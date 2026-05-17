"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Lock, Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const meals = [
  {
    id: "breakfast",
    icon: "☀️",
    name: "Cafe da manha",
    calories: 450,
    items: [
      { name: "Ovos mexidos", amount: "3 unidades (180g)" },
      { name: "Pao integral", amount: "2 fatias (60g)" },
      { name: "Banana", amount: "1 unidade (120g)" },
      { name: "Pasta de amendoim", amount: "1 colher (20g)" },
    ],
  },
  {
    id: "lunch",
    icon: "🥗",
    name: "Almoco",
    calories: 680,
    items: [
      { name: "Arroz integral", amount: "150g" },
      { name: "Peito de frango grelhado", amount: "200g" },
      { name: "Brocolis", amount: "100g" },
      { name: "Batata doce", amount: "150g" },
      { name: "Azeite de oliva", amount: "1 colher (10ml)" },
    ],
  },
  {
    id: "snack",
    icon: "🍎",
    name: "Lanche da tarde",
    calories: 320,
    items: [
      { name: "Whey protein", amount: "1 scoop (30g)" },
      { name: "Aveia", amount: "40g" },
      { name: "Morango", amount: "100g" },
      { name: "Castanhas", amount: "30g" },
    ],
  },
  {
    id: "dinner",
    icon: "🌙",
    name: "Jantar",
    calories: 550,
    items: [
      { name: "File de tilapia", amount: "200g" },
      { name: "Quinoa", amount: "100g" },
      { name: "Salada verde", amount: "150g" },
      { name: "Abacate", amount: "80g" },
    ],
  },
]

export function NutritionScreen({ onBack }: { onBack: () => void }) {
  const [unlocked, setUnlocked] = useState(false)

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={onBack}>
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-foreground">Plano Nutricional</h2>
            {unlocked && <p className="text-xs text-muted-foreground">Gerado por IA para seu objetivo</p>}
          </div>
        </div>
      </div>

      {!unlocked ? (
        /* Locked state */
        <div className="px-4 pt-8">
          <div className="glass rounded-2xl p-6 text-center relative overflow-hidden">
            {/* Blurred preview */}
            <div className="absolute inset-0 opacity-20 blur-sm p-6">
              <div className="flex flex-col gap-2 text-left text-sm text-foreground">
                <p>Cafe da manha: 450 kcal</p>
                <p>Almoco: 680 kcal</p>
                <p>Lanche: 320 kcal</p>
                <p>Jantar: 550 kcal</p>
              </div>
            </div>

            <div className="relative z-10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Seu plano nutricional personalizado por IA</h3>
              <div className="mt-4 flex flex-col gap-2 text-left">
                {[
                  "Plano completo por objetivo",
                  "Do cafe da manha ao jantar",
                  "Lista de compras inclusa",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setUnlocked(true)}
                className="mt-6 h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground neon-glow hover:bg-primary/90"
              >
                Desbloquear por R$37
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Unlocked state */
        <div className="px-4 pt-4">
          {/* Summary */}
          <div className="glass rounded-xl p-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/20 text-primary border-0">Hipertrofia</Badge>
              <Badge className="bg-secondary text-foreground border-0">2000 kcal</Badge>
              <Badge className="bg-secondary text-foreground border-0">160g Prot</Badge>
              <Badge className="bg-secondary text-foreground border-0">220g Carb</Badge>
              <Badge className="bg-secondary text-foreground border-0">65g Gord</Badge>
            </div>
          </div>

          {/* Meals */}
          <Accordion type="multiple" defaultValue={["breakfast"]} className="mt-4">
            {meals.map((meal) => (
              <AccordionItem key={meal.id} value={meal.id} className="border-border">
                <AccordionTrigger className="py-3 text-foreground hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span>{meal.icon}</span>
                    <span className="font-medium">{meal.name}</span>
                    <span className="text-xs text-primary font-bold">{meal.calories} kcal</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 pb-2">
                    {meal.items.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-lg bg-secondary p-2">
                        <span className="text-sm text-foreground">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <Button className="h-12 w-full rounded-xl bg-primary text-primary-foreground neon-glow hover:bg-primary/90">
              <Download className="mr-2 h-5 w-5" />
              Baixar PDF do Plano
            </Button>
            <Button variant="outline" disabled className="h-12 w-full rounded-xl border-border text-muted-foreground">
              Gerar novo plano
              <span className="ml-2 text-xs opacity-60">Disponivel em 28 dias</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
