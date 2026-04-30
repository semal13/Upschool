import { useMemo, useState } from 'react'
import { cn } from '../lib/cn'
import { Button } from './ui/Button'
import { OnboardingStep } from './onboarding/OnboardingStep'
import type { Budget, Lifestyle, Symptom, UserProfile } from '../userProfileStorage'

const TOTAL = 5

const SYMPTOMS: { value: Symptom; label: string; desc: string; icon: string }[] = [
  {
    value: 'insulin',
    label: 'İnsülin direnci / kan şekeri',
    desc: 'Enerji dalgalanmaları, tatlı isteği, yorgunluk eğilimi.',
    icon: '⚡',
  },
  {
    value: 'acne',
    label: 'Akne / cilt',
    desc: 'Hormonlarla ilişkili olabilen görünür belirtiler.',
    icon: '✨',
  },
  {
    value: 'cycle',
    label: 'Döngü düzensizliği',
    desc: 'Gecikme, takip zorluğu, döngü belirsizliği.',
    icon: '🌙',
  },
  {
    value: 'mood',
    label: 'Ruh hali & stres',
    desc: 'Kaygı, dalgalanma, “kendimi iyi hissetmiyorum” anları.',
    icon: '💜',
  },
  {
    value: 'fatigue',
    label: 'Halsizlik ve Yorgunluk',
    desc: 'Sıfır enerji hissi, bedenin “yavaşla” demesi.',
    icon: '🌿',
  },
]

const LIFESTYLES: { value: Lifestyle; label: string; desc: string; icon: string }[] = [
  {
    value: 'student_dorm',
    label: 'Öğrenciyim (Yurtta)',
    desc: 'Sınırlı mutfak, pratik seçenekler, uygun maliyet.',
    icon: '🎓',
  },
  {
    value: 'student_home',
    label: 'Öğrenciyim (Evde)',
    desc: 'Paylaşımlı ev düzeni, daha esnek alışveriş.',
    icon: '🏠',
  },
  {
    value: 'working_outside',
    label: 'Çalışıyorum (Ofiste/Dışarıda)',
    desc: 'Uygun taşıma, kısa hazırlık, hareket halindeyken destek.',
    icon: '🗓️',
  },
  {
    value: 'work_from_home_housewife',
    label: 'Evden Çalışıyorum / Ev Hanımıyım',
    desc: 'Ev düzeninde kolay rutinler, gün içinde nefes alan planlar.',
    icon: '☕',
  },
]

const BUDGETS: { value: Budget; label: string; desc: string; icon: string }[] = [
  {
    value: 'student_friendly',
    label: 'Öğrenci dostu — düşük maliyet',
    desc: 'Daha kolay ulaşılabilir, bütçe dostu fikirler.',
    icon: '🧺',
  },
  {
    value: 'budget_focus',
    label: 'Bütçe odaklı — her kuruş planlı',
    desc: 'Miktar ve satın alma planlarıyla rahatlama.',
    icon: '📌',
  },
  {
    value: 'no_budget_issue',
    label: 'Bütçe sorunum yok / Esneğim',
    desc: 'Daha esnek öneriler ve alternatifler.',
    icon: '✨',
  },
]

type SelectCardProps = {
  selected: boolean
  icon: string
  label: string
  desc?: string
  onClick: () => void
  multi?: boolean
}

function SelectCard({ selected, icon, label, desc, onClick }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-4 rounded-3xl border-2 bg-white/80 p-4 text-left shadow-sm transition-all duration-200',
        'hover:border-talya-sage/50 hover:shadow-md',
        selected ? 'border-talya-sage ring-2 ring-talya-sage/25' : 'border-transparent ring-1 ring-talya-sage/10',
      )}
    >
      <span
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl',
          selected ? 'bg-talya-sage/20' : 'bg-talya-sage/10',
        )}
        aria-hidden
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-talya-forest">{label}</span>
        {desc ? <span className="mt-1 block text-sm font-medium text-talya-forest/65">{desc}</span> : null}
      </span>

      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors',
          selected ? 'border-talya-sage bg-talya-sage text-white' : 'border-talya-sage/30 bg-white text-transparent',
        )}
        aria-hidden
      >
        ✓
      </span>
    </button>
  )
}

type OnboardingProps = {
  onComplete: (profile: UserProfile) => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [lifestyle, setLifestyle] = useState<Lifestyle | null>(null)
  const [budget, setBudget] = useState<Budget | null>(null)
  const [cycleDay, setCycleDay] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const selectedSymptoms = useMemo(() => new Set(symptoms), [symptoms])

  function toggleSymptom(s: Symptom) {
    setSymptoms((prev) => {
      const exists = prev.includes(s)
      if (exists) return prev.filter((x) => x !== s)
      return [...prev, s]
    })
  }

  function next() {
    setError(null)

    if (step === 0 && !name.trim()) {
      setError('İsmini yazalım ki sana doğru ve şefkatli hitap edelim.')
      return
    }
    if (step === 1 && symptoms.length === 0) {
      setError('Birden fazla seçenek işaretleyebilirsin. En az bir semptom seç.')
      return
    }
    if (step === 2 && !lifestyle) {
      setError('Yaşam tarzına en yakın seçeneği işaretle.')
      return
    }
    if (step === 3 && !budget) {
      setError('Bütçe durumuna en yakın seçeneği işaretle.')
      return
    }

    if (step < TOTAL - 1) setStep((s) => s + 1)
    else finish()
  }

  function back() {
    setError(null)
    if (step > 0) setStep((s) => s - 1)
  }

  function finish() {
    if (!lifestyle || !budget) return

    const profile: UserProfile = {
      schemaVersion: 4,
      name: name.trim(),
      symptoms,
      lifestyle,
      budget,
      cycleDay: Math.min(35, Math.max(1, cycleDay)),
      onboardedAt: new Date().toISOString(),
    }

    onComplete(profile)
  }

  const inputClass =
    'mt-3 w-full rounded-3xl border-2 border-talya-sage/20 bg-white px-4 py-3.5 text-base font-medium text-talya-forest shadow-sm outline-none transition placeholder:text-talya-forest/40 focus:border-talya-sage focus:ring-2 focus:ring-talya-sage/20'

  const footer = (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      {step > 0 ? (
        <Button type="button" variant="secondary" className="sm:order-1" onClick={back}>
          Geri
        </Button>
      ) : null}
      <Button type="button" className="sm:order-2 sm:min-w-[200px]" onClick={next}>
        {step === TOTAL - 1 ? 'Kaydet / Başla' : 'İleri'}
      </Button>
    </div>
  )

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-lg flex-col">
      {step === 0 && (
        <OnboardingStep stepIndex={0} totalSteps={TOTAL} title="Merhaba, ben Talya" subtitle="Sana nasıl seslenelim?" footer={footer}>
          <label htmlFor="ob-name" className="sr-only">
            İsim
          </label>
          <input
            id="ob-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Adın veya takma adın"
            maxLength={60}
            autoComplete="nickname"
          />
          {error ? <p className="mt-3 text-sm font-medium text-red-700/90">{error}</p> : null}
        </OnboardingStep>
      )}

      {step === 1 && (
        <OnboardingStep
          stepIndex={1}
          totalSteps={TOTAL}
          title="Zorlanılan semptomlar"
          subtitle="Birden fazla seçebilirsin — yargı yok."
          footer={footer}
        >
          <ul className="flex flex-col gap-3">
            {SYMPTOMS.map((opt) => (
              <li key={opt.value}>
                <SelectCard
                  selected={selectedSymptoms.has(opt.value)}
                  onClick={() => toggleSymptom(opt.value)}
                  icon={opt.icon}
                  label={opt.label}
                  desc={opt.desc}
                />
              </li>
            ))}
          </ul>
          {error ? <p className="mt-3 text-sm font-medium text-red-700/90">{error}</p> : null}
        </OnboardingStep>
      )}

      {step === 2 && (
        <OnboardingStep
          stepIndex={2}
          totalSteps={TOTAL}
          title="Yaşam tarzın"
          subtitle="Tarifler ve destek buna göre uyarlanır."
          footer={footer}
        >
          <ul className="flex flex-col gap-3">
            {LIFESTYLES.map((opt) => (
              <li key={opt.value}>
                <SelectCard
                  selected={lifestyle === opt.value}
                  onClick={() => setLifestyle(opt.value)}
                  icon={opt.icon}
                  label={opt.label}
                  desc={opt.desc}
                />
              </li>
            ))}
          </ul>
          {error ? <p className="mt-3 text-sm font-medium text-red-700/90">{error}</p> : null}
        </OnboardingStep>
      )}

      {step === 3 && (
        <OnboardingStep
          stepIndex={3}
          totalSteps={TOTAL}
          title="Bütçe durumun"
          subtitle="Önerileri daha rahat hissettiren noktaya göre ayarlayalım."
          footer={footer}
        >
          <ul className="flex flex-col gap-3">
            {BUDGETS.map((opt) => (
              <li key={opt.value}>
                <SelectCard
                  selected={budget === opt.value}
                  onClick={() => setBudget(opt.value)}
                  icon={opt.icon}
                  label={opt.label}
                  desc={opt.desc}
                />
              </li>
            ))}
          </ul>
          {error ? <p className="mt-3 text-sm font-medium text-red-700/90">{error}</p> : null}
        </OnboardingStep>
      )}

      {step === 4 && (
        <OnboardingStep
          stepIndex={4}
          totalSteps={TOTAL}
          title="Döngü günün (tahmini)"
          subtitle="1–35 arası, yaklaşık değer yeterli."
          footer={footer}
        >
          <div className="flex flex-col items-center gap-6 py-4">
            <p className="font-semibold text-5xl text-talya-sage-deep">{cycleDay}</p>
            <input
              type="range"
              min={1}
              max={35}
              value={cycleDay}
              onChange={(e) => setCycleDay(Number(e.target.value))}
              className="h-2 w-full max-w-xs cursor-pointer accent-talya-sage"
              aria-valuemin={1}
              aria-valuemax={35}
              aria-valuenow={cycleDay}
            />
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setCycleDay((d) => Math.max(1, d - 1))}>
                −1
              </Button>
              <Button type="button" variant="secondary" onClick={() => setCycleDay((d) => Math.min(35, d + 1))}>
                +1
              </Button>
            </div>
          </div>
          {error ? <p className="mt-3 text-sm font-medium text-red-700/90">{error}</p> : null}
        </OnboardingStep>
      )}
    </div>
  )
}

