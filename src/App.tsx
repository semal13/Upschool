import { useState } from 'react'
import { HomeDashboard } from './components/HomeDashboard'
import { Onboarding } from './components/Onboarding'
import { TalyaChatScreen } from './components/TalyaChatScreen'
import { loadUserProfile, saveUserProfile, type UserProfile } from './userProfileStorage'

type View = 'onboarding' | 'home' | 'chat'

export default function App() {
  const initialProfile = loadUserProfile()
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile)
  const [view, setView] = useState<View>(initialProfile ? 'home' : 'onboarding')

  function handleOnboardingComplete(next: UserProfile) {
    saveUserProfile(next)
    setProfile(next)
    setView('home')
  }

  if (!profile) {
    return (
      <div className="min-h-dvh bg-talya-cream">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-3xl focus:bg-talya-sage focus:px-3 focus:py-2 focus:text-white"
        >
          Ana içeriğe geç
        </a>
        <div id="main" className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-8 pt-10 sm:px-8">
          <header className="mb-6 text-center animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-talya-sage-deep">Talya</p>
            <p className="mt-2 text-sm font-medium text-talya-forest/65">PCOS için şefkatli dijital yoldaşın</p>
          </header>
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    )
  }

  if (view === 'chat') {
    return <TalyaChatScreen onBack={() => setView('home')} />
  }

  return (
    <div className="min-h-dvh bg-talya-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-3xl focus:bg-talya-sage focus:px-3 focus:py-2 focus:text-white"
      >
        Ana içeriğe geç
      </a>
      <main id="main" className="mx-auto max-w-lg px-5 pb-10 pt-8 sm:px-8">
        <HomeDashboard profile={profile} onOpenChat={() => setView('chat')} />
      </main>
    </div>
  )
}
