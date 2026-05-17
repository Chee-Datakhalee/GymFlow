"use client"

import { useState } from "react"
import { Upload, Plus, X, Dumbbell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const initialPlans = [
  { id: "1", name: "Basico", value: "R$99,90", duration: "Mensal" },
  { id: "2", name: "Premium", value: "R$149,90", duration: "Mensal" },
  { id: "3", name: "Anual", value: "R$1.199,00", duration: "12 meses" },
]

export function AcademySettings() {
  const [plans, setPlans] = useState(initialPlans)

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-sm text-muted-foreground">Gerencie sua academia</p>
      </div>

      {/* Academy Info */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Dados da Academia</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary">
              <Dumbbell className="h-8 w-8 text-muted-foreground" />
            </div>
            <Button variant="outline" className="border-border text-foreground">
              <Upload className="mr-2 h-4 w-4" />
              Alterar logo
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">Nome da academia</Label>
              <Input
                defaultValue="GymFlow Fitness"
                className="border-border bg-secondary text-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">Telefone</Label>
              <Input
                defaultValue="(11) 99999-9999"
                className="border-border bg-secondary text-foreground"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Endereco</Label>
            <Input
              defaultValue="Rua das Flores, 123 — Sao Paulo, SP"
              className="border-border bg-secondary text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Planos</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="border-border text-foreground"
            onClick={() => setPlans([...plans, { id: String(plans.length + 1), name: "", value: "", duration: "" }])}
          >
            <Plus className="mr-1 h-4 w-4" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {plans.map((plan) => (
              <div key={plan.id} className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <Input
                  defaultValue={plan.name}
                  placeholder="Nome do plano"
                  className="border-border bg-background text-foreground flex-1"
                />
                <Input
                  defaultValue={plan.value}
                  placeholder="Valor"
                  className="border-border bg-background text-foreground w-32"
                />
                <Input
                  defaultValue={plan.duration}
                  placeholder="Duracao"
                  className="border-border bg-background text-foreground w-32"
                />
                <button
                  onClick={() => setPlans(plans.filter((p) => p.id !== plan.id))}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Integration */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Integracao WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Conecte seu numero via Z-API para enviar alertas automaticos
          </p>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Token Z-API</Label>
            <Input
              type="password"
              placeholder="Cole seu token aqui"
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Numero do WhatsApp</Label>
            <Input
              placeholder="5511999999999"
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button className="w-fit bg-primary text-primary-foreground neon-glow hover:bg-primary/90">
            Conectar WhatsApp
          </Button>
        </CardContent>
      </Card>

      {/* App Customization */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Personalizacao do App</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Customize a cor principal do app dos seus alunos
          </p>
          <div className="flex items-center gap-3">
            <Label className="text-muted-foreground">Cor principal</Label>
            <div className="flex gap-2">
              {["#00FF87", "#00D4FF", "#FF6B6B", "#FFD93D", "#C084FC"].map((color) => (
                <button
                  key={color}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === "#00FF87" ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end pb-8">
        <Button className="bg-primary text-primary-foreground neon-glow hover:bg-primary/90 px-8">
          Salvar Configuracoes
        </Button>
      </div>
    </div>
  )
}
