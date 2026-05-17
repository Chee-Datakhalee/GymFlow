"use client"
import { useState, useEffect } from "react"
import { OnboardingScreen } from "./onboarding-screen"
import { HomeFeed } from "./home-feed"
import { PostScreen } from "./post-screen"
import { WorkoutScreen } from "./workout-screen"
import { EvolutionScreen } from "./evolution-screen"
import { RankingScreen } from "./ranking-screen"
import { ProfileScreen } from "./profile-screen"
import { NutritionScreen } from "./nutrition-screen"
import { BottomNav } from "./bottom-nav"
import { WeekSetupScreen } from "./week-setup-screen"
import { supabase } from "@/lib/supabase"

type Screen = "loading" | "onboarding" | "weekSetup" | "feed" | "workout" | "post" | "ranking" | "profile" | "evolution" | "nutrition"

export function StudentApp({ onSwitchToAcademy }: { onSwitchToAcademy: () => void }) {
  const [screen, setScreen] = useState<Screen>("loading")
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [showPost, setShowPost] = useState(false)

  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setScreen("onboarding"); return }

      // Verifica se já tem aluno cadastrado
      const { data: aluno } = await supabase
        .from('alunos')
        .select('id')
        .eq('profile_id', user.id)
        .single()

      if (!aluno) { setScreen("onboarding"); return }

      // Verifica se já tem dias de treino configurados
      const { data: dias } = await supabase
        .from('dias_treino')
        .select('id')
        .eq('aluno_id', aluno.id)
        .limit(1)

      if (!dias || dias.length === 0) { setScreen("weekSetup"); return }

      setScreen("feed")
    }
    checkStatus()
  }, [])

  if (screen === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (screen === "onboarding") {
    return (
      <OnboardingScreen
        step={onboardingStep}
        onNext={() => {
          if (onboardingStep < 3) {
            setOnboardingStep(onboardingStep + 1)
          } else {
            setScreen("weekSetup")
          }
        }}
        onSwitchToAcademy={onSwitchToAcademy}
      />
    )
  }

  if (screen === "weekSetup") {
    return <WeekSetupScreen onContinue={() => setScreen("feed")} />
  }

  if (showPost) {
    return <PostScreen onClose={() => setShowPost(false)} />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-[430px] flex-1 pb-20">
        {screen === "feed" && <HomeFeed />}
        {screen === "workout" && <WorkoutScreen />}
        {screen === "ranking" && <RankingScreen />}
        {screen === "profile" && (
          <ProfileScreen
            onNavigate={(s: string) => {
              if (s === "evolution") setScreen("evolution")
              if (s === "nutrition") setScreen("nutrition")
            }}
          />
        )}
        {screen === "evolution" && <EvolutionScreen onBack={() => setScreen("profile")} />}
        {screen === "nutrition" && <NutritionScreen onBack={() => setScreen("profile")} />}
      </div>
      <BottomNav
        active={screen}
        onNavigate={(s) => setScreen(s as Screen)}
        onPost={() => setShowPost(true)}
      />
    </div>
  )
}
