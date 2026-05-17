"use client"

import { useState } from "react"
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

type Screen = "onboarding" | "weekSetup" | "feed" | "workout" | "post" | "ranking" | "profile" | "evolution" | "nutrition"

export function StudentApp({ onSwitchToAcademy }: { onSwitchToAcademy: () => void }) {
  const [screen, setScreen] = useState<Screen>("onboarding")
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [showPost, setShowPost] = useState(false)

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
