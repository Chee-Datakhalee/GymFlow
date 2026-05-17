"use client"

import { useState } from "react"
import { Bell, MessageCircle, Trophy, Clock, Send, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const mockNotifications = [
  { id: "1", type: "inativo", text: "Rafael Mendes inativo ha 14 dias", action: "WhatsApp enviado", time: "Hoje, 10:30", icon: Clock },
  { id: "2", type: "inativo", text: "Carlos Rocha inativo ha 18 dias", action: "WhatsApp enviado", time: "Hoje, 10:30", icon: Clock },
  { id: "3", type: "financeiro", text: "Mensalidade de Maria Costa vencendo em 3 dias", action: "WhatsApp enviado", time: "Ontem, 14:00", icon: Bell },
  { id: "4", type: "pr", text: "Lucas Silva bateu PR — Supino 85kg", action: "Apareceu no feed", time: "Ontem, 09:15", icon: Trophy },
  { id: "5", type: "financeiro", text: "Mensalidade de Thiago Alves venceu ha 11 dias", action: "WhatsApp enviado", time: "13/05, 08:00", icon: Bell },
  { id: "6", type: "pr", text: "Fernanda Lima bateu PR — Agachamento 80kg", action: "Apareceu no feed", time: "12/05, 16:45", icon: Trophy },
  { id: "7", type: "inativo", text: "Thiago Alves inativo ha 8 dias", action: "WhatsApp enviado", time: "12/05, 10:00", icon: Clock },
]

const typeColors: Record<string, string> = {
  inativo: "bg-yellow-500/20 text-yellow-500 border-0",
  financeiro: "bg-destructive/20 text-destructive border-0",
  pr: "bg-primary/20 text-primary border-0",
}

const typeLabels: Record<string, string> = {
  inativo: "Inatividade",
  financeiro: "Financeiro",
  pr: "PR",
}

export function AcademyNotifications() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notificacoes</h1>
          <p className="text-sm text-muted-foreground">Alertas automaticos e manuais</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground neon-glow hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Criar notificacao manual
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">Nova Notificacao</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Mensagem para todos os alunos</label>
                <Textarea
                  placeholder="Digite sua mensagem..."
                  className="min-h-[120px] border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button
                onClick={() => setOpen(false)}
                className="bg-primary text-primary-foreground neon-glow hover:bg-primary/90"
              >
                <Send className="mr-2 h-4 w-4" />
                Enviar para todos
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notifications list */}
      <div className="flex flex-col gap-3">
        {mockNotifications.map((notif) => (
          <Card key={notif.id} className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary ${
                notif.type === "pr" ? "text-primary" : notif.type === "inativo" ? "text-yellow-500" : "text-destructive"
              }`}>
                <notif.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{notif.text}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className={typeColors[notif.type]}>
                    {typeLabels[notif.type]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{notif.action}</span>
                </div>
              </div>
              <span className="flex-shrink-0 text-xs text-muted-foreground">{notif.time}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
