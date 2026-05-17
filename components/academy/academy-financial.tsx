"use client"

import { DollarSign, Clock, AlertTriangle, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockUsers, mockMonthlyRevenue } from "@/lib/mock-data"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const paymentStatusMap = {
  pago: { label: "Pago", className: "bg-primary/20 text-primary border-0" },
  pendente: { label: "Pendente", className: "bg-yellow-500/20 text-yellow-500 border-0" },
  atrasado: { label: "Atrasado", className: "bg-destructive/20 text-destructive border-0" },
}

const totalRevenue = mockUsers.filter((u) => u.paymentStatus === "pago").reduce((acc, u) => acc + u.monthlyFee, 0)
const pendingRevenue = mockUsers.filter((u) => u.paymentStatus === "pendente").reduce((acc, u) => acc + u.monthlyFee, 0)
const lateRevenue = mockUsers.filter((u) => u.paymentStatus === "atrasado").reduce((acc, u) => acc + u.monthlyFee, 0)

const financialStats = [
  { label: "Receita do Mes", value: `R$${totalRevenue.toFixed(2).replace(".", ",")}`, icon: DollarSign, color: "text-primary" },
  { label: "A Receber", value: `R$${pendingRevenue.toFixed(2).replace(".", ",")}`, icon: Clock, color: "text-yellow-500" },
  { label: "Atrasados", value: `R$${lateRevenue.toFixed(2).replace(".", ",")}`, icon: AlertTriangle, color: "text-destructive" },
]

export function AcademyFinancial() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
        <p className="text-sm text-muted-foreground">Controle de mensalidades</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {financialStats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-secondary ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Receita Mensal — Ultimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                  formatter={(value: number) => [`R$${value.toLocaleString("pt-BR")}`, "Receita"]}
                />
                <Bar dataKey="revenue" fill="#00FF87" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Aluno</TableHead>
              <TableHead className="text-muted-foreground">Plano</TableHead>
              <TableHead className="text-muted-foreground">Valor</TableHead>
              <TableHead className="text-muted-foreground">Vencimento</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="border-border hover:bg-secondary/50">
                <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                <TableCell className="text-foreground">{user.plan}</TableCell>
                <TableCell className="text-foreground">R${user.monthlyFee.toFixed(2).replace(".", ",")}</TableCell>
                <TableCell className="text-foreground">{new Date(user.dueDate).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  <Badge className={paymentStatusMap[user.paymentStatus].className}>
                    {paymentStatusMap[user.paymentStatus].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.paymentStatus === "atrasado" && (
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      <MessageCircle className="mr-1 h-4 w-4" />
                      Cobrar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
