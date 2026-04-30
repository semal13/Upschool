import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'
import { getYesterdaySymptomSummary, saveWellbeingLog } from '../storage/wellbeingLog'
import { loadSteps, loadWater, saveSteps, saveWater, type WaterState } from '../storage/dailyMetrics'
import { predictNextPeriodLabel, type UserProfile } from '../userProfileStorage'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

type Props = {
  profile: UserProfile
  onOpenChat: () => void
}

export function HomeDashboard({ profile, onOpenChat }: Props) {
  const [water, setWater] = useState<WaterState>(() => loadWater())
  const [steps, setSteps] = useState(() => loadSteps())
  const [symptomOpen, setSymptomOpen] = useState(false)
  const [symptomDraft, setSymptomDraft] = useState('')
  const [summaryLine, setSummaryLine] = useState(() => getYesterdaySymptomSummary())

  useEffect(() => {
    saveWater(water)
  }, [water])

  useEffect(() => {
    saveSteps(steps)
  }, [steps])

  function saveSymptoms() {
    if (!symptomDraft.trim()) return
    saveWellbeingLog(symptomDraft)
    setSummaryLine(getYesterdaySymptomSummary())
    setSymptomDraft('')
    setSymptomOpen(false)
  }

  const gridCard =
    'flex flex-col items-start gap-2 rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-talya-sage/10 transition hover:ring-talya-sage/30 active:scale-[0.98]'

  return (
    <div className="animate-fade-in space-y-5 pb-8">
      <header className="px-1 pt-2">
        <p className="text-sm font-medium text-talya-forest/70">Hoş geldin</p>
        <h1 className="mt-1 text-2xl font-semibold text-talya-forest sm:text-3xl">
          Merhaba, {profile.name}!
        </h1>
        <p className="mt-2 text-sm font-medium text-talya-forest/65">Bugün nasıl hissediyorsun?</p>
      </header>

      <Card className="space-y-3 !p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-talya-sage-deep">Özet</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-talya-forest">Döngü günü {profile.cycleDay}</span>
          <span className="text-sm font-medium text-talya-forest/55">· tahmini takip</span>
        </div>
        <p className="text-sm font-medium leading-relaxed text-talya-forest/75">
          {predictNextPeriodLabel(profile.cycleDay)}
        </p>
        <div className="rounded-2xl bg-talya-sage/10 px-3 py-2.5">
          <p className="text-xs font-semibold text-talya-forest/80">Dün / son semptom özeti</p>
          <p className="mt-1 text-sm font-medium text-talya-forest/85">{summaryLine}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" className={cn(gridCard, 'text-left')} onClick={() => setSymptomOpen(true)}>
          <span className="text-2xl" aria-hidden>
            📋
          </span>
          <span className="font-semibold text-talya-forest">Semptom kaydı</span>
          <span className="text-xs font-medium text-talya-forest/55">Kısa not ekle</span>
        </button>

        <div className={cn(gridCard, 'col-span-1')}>
          <span className="text-2xl" aria-hidden>
            💧
          </span>
          <span className="font-semibold text-talya-forest">Su</span>
          <span className="text-sm font-semibold text-talya-sage-deep">
            {water.liters.toFixed(2)} L / {water.goal} L
          </span>
          <div className="mt-2 flex w-full gap-2">
            <button
              type="button"
              className="flex-1 rounded-2xl bg-talya-sage/15 py-2 text-sm font-semibold text-talya-forest"
              onClick={() => setWater((w) => ({ ...w, liters: Math.max(0, +(w.liters - 0.125).toFixed(3)) }))}
            >
              −
            </button>
            <button
              type="button"
              className="flex-1 rounded-2xl bg-talya-sage/15 py-2 text-sm font-semibold text-talya-forest"
              onClick={() => setWater((w) => ({ ...w, liters: +(w.liters + 0.125).toFixed(3) }))}
            >
              +
            </button>
          </div>
        </div>

        <div className={cn(gridCard)}>
          <span className="text-2xl" aria-hidden>
            👣
          </span>
          <span className="font-semibold text-talya-forest">Adımlar</span>
          <span className="text-lg font-semibold text-talya-forest">{steps.steps.toLocaleString('tr-TR')}</span>
          <span className="text-xs font-medium text-talya-forest/50">Sensör senkronu (demo)</span>
          <div className="mt-2 flex w-full gap-2">
            <button
              type="button"
              className="flex-1 rounded-2xl bg-talya-sage/15 py-2 text-sm font-semibold text-talya-forest"
              onClick={() => setSteps((s) => ({ ...s, steps: Math.max(0, s.steps - 500) }))}
            >
              −
            </button>
            <button
              type="button"
              className="flex-1 rounded-2xl bg-talya-sage/15 py-2 text-sm font-semibold text-talya-forest"
              onClick={() => setSteps((s) => ({ ...s, steps: s.steps + 500 }))}
            >
              +
            </button>
          </div>
        </div>

        <button type="button" className={cn(gridCard, 'bg-talya-sage/90 ring-talya-sage')} onClick={onOpenChat}>
          <span className="text-2xl" aria-hidden>
            ✨
          </span>
          <span className="font-semibold text-white">Sohbet başlat</span>
          <span className="text-xs font-medium text-white/85">Talya ile konuş</span>
        </button>
      </div>

      {symptomOpen ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-talya-forest/25 p-4 backdrop-blur-sm sm:items-center animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="symptom-title"
        >
          <Card className="relative z-10 w-full max-w-md !p-6 shadow-soft">
            <h2 id="symptom-title" className="text-lg font-semibold text-talya-forest">
              Bugün nasılsın?
            </h2>
            <p className="mt-1 text-sm font-medium text-talya-forest/65">Kısa bir not yeterli.</p>
            <textarea
              value={symptomDraft}
              onChange={(e) => setSymptomDraft(e.target.value)}
              rows={4}
              className="mt-4 w-full resize-none rounded-3xl border-2 border-talya-sage/20 px-4 py-3 text-sm font-medium text-talya-forest outline-none focus:border-talya-sage"
              placeholder="Örn. şişkinlik, enerji düşük…"
            />
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" type="button" onClick={() => setSymptomOpen(false)}>
                Vazgeç
              </Button>
              <Button className="flex-1" type="button" onClick={saveSymptoms}>
                Kaydet
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
