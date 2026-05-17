"use client"

import { useState } from "react"
import { StudentApp } from "@/components/student/student-app"
import { AcademyPanel } from "@/components/academy/academy-panel"

export default function Home() {
  const [mode, setMode] = useState<"student" | "academy">("student")

  if (mode === "academy") {
    return <AcademyPanel onSwitchToStudent={() => setMode("student")} />
  }

  return <StudentApp onSwitchToAcademy={() => setMode("academy")} />
}
