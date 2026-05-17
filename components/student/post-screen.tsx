"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Camera, ImageIcon, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PostScreen({ onClose }: { onClose: () => void }) {
  const [posted, setPosted] = useState(false)

  if (posted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="mx-auto w-full max-w-[430px] px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary neon-glow"
          >
            <Check className="h-12 w-12 text-primary-foreground" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground"
          >
            Postado!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-muted-foreground"
          >
            Sua foto ja esta no feed
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-xl border-border text-foreground"
            >
              Voltar ao Feed
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-[430px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <button onClick={onClose}>
            <X className="h-6 w-6 text-foreground" />
          </button>
          <span className="font-semibold text-foreground">Nova Foto</span>
          <div className="w-6" />
        </div>

        {/* Camera area */}
        <div className="aspect-square w-full bg-secondary">
          <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
            <Camera className="h-16 w-16" />
            <p className="text-sm">Toque para tirar uma foto</p>
          </div>
        </div>

        {/* Gallery option */}
        <div className="border-t border-border p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm text-foreground transition-colors hover:bg-secondary/80">
            <ImageIcon className="h-5 w-5" />
            Escolher da galeria
          </button>
        </div>

        {/* Post button */}
        <div className="px-4">
          <Button
            onClick={() => setPosted(true)}
            className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground neon-glow hover:bg-primary/90"
          >
            Postar
          </Button>
        </div>
      </div>
    </div>
  )
}
