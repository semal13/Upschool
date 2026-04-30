import { useMemo, useState } from 'react'
import { cn } from '../lib/cn'
import { glassCard, neumoBtnSm } from '../ui/glass'
import type { UserProfile } from '../userProfileStorage'

type Tab = 'recipes' | 'workouts'

const RECIPES = [
  {
    id: '1',
    title: 'Mercimek & bulgur köftesi',
    budget: 'student_friendly' as const,
    desc: 'Fırınsız, öğrenci mutfağına uygun protein + lif.',
  },
  {
    id: '2',
    title: 'Yoğurtlu nohut salatası',
    budget: 'student_friendly' as const,
    desc: 'Soğuk tüketim; hazırlığı 10 dk.',
  },
  {
    id: '3',
    title: 'Fırında sebze tepsisi',
    budget: 'budget_focus' as const,
    desc: 'Mevsim sebzeleri, tek tepsi — porsiyon başı düşük maliyet.',
  },
  {
    id: '4',
    title: 'Yulaf + chia pudingi',
    budget: 'budget_focus' as const,
    desc: 'Akşamdan hazırla; kan şekeri dostu atıştırmalık.',
  },
]

function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-talya-mint/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#2d2640]">
      <span className="text-talya-lavender" aria-hidden>
        ✦
      </span>
      AI önerisi
    </span>
  )
}

type Props = { profile: UserProfile }

export function LifestyleCoaching({ profile }: Props) {
  const [tab, setTab] = useState<Tab>('recipes')

  const recipes = useMemo(() => {
    if (profile.budget === 'student_friendly') {
      return RECIPES.filter((r) => r.budget === 'student_friendly')
    }
    if (profile.budget === 'budget_focus') {
      return RECIPES.filter((r) => r.budget === 'budget_focus')
    }
    return RECIPES
  }, [profile.budget])

  const workoutType = profile.cycleDay <= 7 ? 'Yoga & nefes' : 'PCOS güç'

  return (
    <div className="flex flex-col gap-4 pb-4">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-[#2d2640]">Yaşam & koçluk</h1>
        <p className="mt-1 text-sm text-[#2d2640]/65">
          Tarifler bütçene göre; hareket döngü gününe göre seçilir (MVP).
        </p>
      </header>

      <div className="flex gap-2 rounded-bento bg-white/35 p-1 shadow-inner">
        <button
          type="button"
          className={cn(
            'flex-1 rounded-[26px] py-2.5 text-sm font-semibold transition',
            tab === 'recipes' ? 'bg-talya-blush/60 text-[#2d2640] shadow-neumo' : 'text-[#2d2640]/50',
          )}
          onClick={() => setTab('recipes')}
        >
          Tarifler
        </button>
        <button
          type="button"
          className={cn(
            'flex-1 rounded-[26px] py-2.5 text-sm font-semibold transition',
            tab === 'workouts' ? 'bg-talya-mint/60 text-[#2d2640] shadow-neumo' : 'text-[#2d2640]/50',
          )}
          onClick={() => setTab('workouts')}
        >
          Egzersiz
        </button>
      </div>

      {tab === 'recipes' && (
        <ul className="flex flex-col gap-3">
          {recipes.map((r) => (
            <li key={r.id} className={cn(glassCard, 'flex gap-4 p-4')}>
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-talya-blush to-talya-mint text-2xl shadow-neumo"
                aria-hidden
              >
                🥗
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium text-[#2d2640]">{r.title}</h2>
                  <AiBadge />
                </div>
                <p className="mt-1 text-sm text-[#2d2640]/70">{r.desc}</p>
                <p className="mt-2 text-xs text-talya-lavender">
                  {profile.budget === 'student_friendly'
                    ? 'Öğrenci dostu / düşük maliyet'
                    : 'Bütçe odaklı plan'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {tab === 'workouts' && (
        <div className={cn(glassCard, 'space-y-4 p-5')}>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-[#2d2640]">{workoutType}</h2>
            <AiBadge />
          </div>
          <p className="text-sm text-[#2d2640]/75">
            Döngü günün ~{profile.cycleDay}: ilk hafta daha yumuşak mobilite; sonrasında kısa güç
            setleri öneriyoruz. Bu öneri bilgilendiricidir; doktorunun planına öncelik ver.
          </p>
          <ul className="space-y-2 text-sm text-[#2d2640]/80">
            <li className="flex items-center justify-between rounded-xl bg-white/40 px-3 py-2">
              <span>10 dk. nefes + omurga esnetme</span>
              <span className={neumoBtnSm}>Tamam</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-white/40 px-3 py-2">
              <span>20 dk. yürüyüş veya hafif tempo</span>
              <span className={neumoBtnSm}>Tamam</span>
            </li>
            {profile.cycleDay > 7 && (
              <li className="flex items-center justify-between rounded-xl bg-white/40 px-3 py-2">
                <span>2 set squat + köprü (vücut ağırlığı)</span>
                <span className={neumoBtnSm}>Tamam</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
