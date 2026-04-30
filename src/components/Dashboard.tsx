import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'
import { glassCard, neumoBtn, neumoBtnSm } from '../ui/glass'
import { loadSteps, loadWater, saveSteps, saveWater, type WaterState } from '../storage/dailyMetrics'
import type { UserProfile } from '../userProfileStorage'
import { Mascot3D } from './Mascot3D'
import { TalyaGeminiChat } from './TalyaGeminiChat'

const INSIGHTS = [
  'PCOS tek bir görüntü değil; hormonal bir spektrumdur ve seni tanımlamaz.',
  'Uyku düzeni, stres yönetimi ile beslenme birlikte ele alındığında yaşam kalitesi artabilir.',
  'İnsülin direncinde düzenli hareket, ilaç yerine geçmez ama destekleyici olabilir.',
]

type Props = { profile: UserProfile }

export function Dashboard({ profile }: Props) {
  const [water, setWater] = useState<WaterState>(() => loadWater())
  const [steps, setSteps] = useState(() => loadSteps())
  const [insightIx, setInsightIx] = useState(0)
  const [geminiOpen, setGeminiOpen] = useState(false)

  useEffect(() => {
    saveWater(water)
  }, [water])

  useEffect(() => {
    saveSteps(steps)
  }, [steps])

  const progress = Math.min(1, water.liters / water.goal)

  return (
    <div className="flex flex-col gap-4 pb-4">
      <header
        className={cn(
          glassCard,
          'flex items-center justify-between gap-4 p-5',
        )}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-talya-lavender">
            Günaydın
          </p>
          <h1 className="font-serif text-2xl font-semibold text-[#2d2640] sm:text-3xl">{profile.name}</h1>
          <p className="mt-1 text-sm text-[#2d2640]/65">
            Döngü günü ~{profile.cycleDay} · Bugün de yumuşak ol.
          </p>
        </div>
        <Mascot3D />
      </header>

      <section className={cn(glassCard, 'p-5')}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#2d2640]">Talya&apos;ya danış</h2>
            <p className="mt-0.5 text-xs text-[#2d2640]/65">
              Gemini ile kişiselleştirilmiş, şefkatli sohbet — tıbbi teşhis değildir.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGeminiOpen(true)}
            className={cn(
              'w-full shrink-0 rounded-3xl bg-gradient-to-r from-talya-lavender to-talya-lavender/90 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105 sm:w-auto',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-talya-lavender',
            )}
          >
            Sohbet başlat
          </button>
        </div>
      </section>

      <TalyaGeminiChat open={geminiOpen} onClose={() => setGeminiOpen(false)} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className={cn(glassCard, 'col-span-2 p-5 sm:col-span-1')}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-[#2d2640]">Su takibi</h2>
              <p className="text-xs text-[#2d2640]/60">Hedef: {water.goal} L</p>
            </div>
            <div className="flex gap-1 rounded-xl bg-white/40 p-1">
              <button
                type="button"
                className={cn(
                  'rounded-lg px-2 py-1 text-xs font-medium',
                  water.goal === 1.4 ? 'bg-talya-mint/80 text-[#2d2640]' : 'text-[#2d2640]/50',
                )}
                onClick={() => setWater((w) => ({ ...w, goal: 1.4 }))}
              >
                1.4L
              </button>
              <button
                type="button"
                className={cn(
                  'rounded-lg px-2 py-1 text-xs font-medium',
                  water.goal === 2.5 ? 'bg-talya-mint/80 text-[#2d2640]' : 'text-[#2d2640]/50',
                )}
                onClick={() => setWater((w) => ({ ...w, goal: 2.5 }))}
              >
                2.5L
              </button>
            </div>
          </div>
          <p className="mt-3 font-serif text-3xl font-semibold text-talya-lavender">
            {water.liters.toFixed(2)}{' '}
            <span className="text-lg font-normal text-[#2d2640]/50">/ {water.goal} L</span>
          </p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-talya-mint to-talya-lavender transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className={neumoBtnSm + ' flex-1'}
              onClick={() => setWater((w) => ({ ...w, liters: Math.max(0, +(w.liters - 0.125).toFixed(3)) }))}
            >
              −0.125 L
            </button>
            <button
              type="button"
              className={neumoBtnSm + ' flex-1'}
              onClick={() => setWater((w) => ({ ...w, liters: +(w.liters + 0.125).toFixed(3) }))}
            >
              +0.125 L
            </button>
          </div>
        </div>

        <div className={cn(glassCard, 'col-span-2 p-5 sm:col-span-1')}>
          <h2 className="text-sm font-semibold text-[#2d2640]">Adım sayacı</h2>
          <p className="mt-1 text-xs leading-snug text-talya-lavender/90">
            Sensörlerle senkron (demo) — gerçek cihaz bağlantısı yakında.
          </p>
          <p className="mt-3 font-serif text-3xl font-semibold text-[#2d2640]">
            {steps.steps.toLocaleString('tr-TR')}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className={neumoBtnSm + ' flex-1'}
              onClick={() => setSteps((s) => ({ ...s, steps: Math.max(0, s.steps - 500) }))}
            >
              −500
            </button>
            <button
              type="button"
              className={neumoBtnSm + ' flex-1'}
              onClick={() => setSteps((s) => ({ ...s, steps: s.steps + 500 }))}
            >
              +500
            </button>
          </div>
        </div>
      </div>

      <section className={cn(glassCard, 'p-5')}>
        <h2 className="text-sm font-semibold text-[#2d2640]">Son başarılar akışı</h2>
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
          <li className="min-w-[140px] rounded-2xl border border-talya-mint/50 bg-talya-mint/25 px-3 py-3 text-center shadow-neumo">
            <span className="text-2xl" aria-hidden>
              🔥
            </span>
            <p className="mt-1 text-xs font-semibold text-[#2d2640]">7 günlük seri</p>
          </li>
          <li className="min-w-[160px] rounded-2xl border border-talya-blush/60 bg-talya-blush/35 px-3 py-3 text-center shadow-neumo">
            <span className="text-2xl" aria-hidden>
              🌿
            </span>
            <p className="mt-1 text-xs font-semibold text-[#2d2640]">Öz-bakım şampiyonu</p>
          </li>
        </ul>
      </section>

      <section className={cn(glassCard, 'p-5')}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-[#2d2640]">Günün içgörüsü</h2>
          <button
            type="button"
            className={cn(neumoBtn, 'px-3 py-1.5 text-xs')}
            onClick={() => setInsightIx((i) => (i + 1) % INSIGHTS.length)}
          >
            Yenile
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#2d2640]/80">{INSIGHTS[insightIx]}</p>
      </section>
    </div>
  )
}
