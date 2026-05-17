"use client"

import { useState } from "react"
import { Mail, Lock, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AcademyLogin({
  onLogin,
  onSwitchToStudent,
}: {
  onLogin: () => void
  onSwitchToStudent: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary neon-glow">
            <Dumbbell className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Gym<span className="text-primary">Flow</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Painel da Academia</p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="academia@email.com"
                  className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-muted-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>

            <Button
              onClick={onLogin}
              className="mt-2 h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground neon-glow hover:bg-primary/90"
            >
              Entrar como Academia
            </Button>
          </div>
        </div>

        <button
          onClick={onSwitchToStudent}
          className="mt-4 block w-full text-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          Sou aluno
        </button>
      </div>
    </div>
  )
}
