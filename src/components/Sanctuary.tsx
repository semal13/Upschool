import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'
import { glassCard, neumoBtn } from '../ui/glass'

type Props = {
  night: boolean
  onNightChange: (v: boolean) => void
}

export function Sanctuary({ night, onNightChange }: Props) {
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  const [thoughts, setThoughts] = useState('')

  useEffect(() => {
    const t = window.setInterval(() => setPhase((p) => (p === 'in' ? 'out' : 'in')), 2750)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    return () => setThoughts('')
  }, [])

  const affirmations = night
    ? ['Dinlen ve yenilen.', 'Bedenin şifa bulmak için nefes alıyor.', 'Bu gece yeterli oldun.']
    : ['Nefesin sana ait bir sığınak.', 'Yavaşlamak güçtür; bugün bunu seçtin.', 'Duyguların geçici; sen kalıcısın.']

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-4 rounded-bento p-1 transition-colors duration-500',
        night ? 'bg-talya-midnight text-talya-cream' : 'bg-transparent',
      )}
    >
      <div className="flex items-center justify-between gap-3 px-2 pt-2">
        <div>
          <h1 className={cn('font-serif text-2xl font-semibold', night ? 'text-talya-cream' : 'text-[#2d2640]')}>
            Sığınağım
          </h1>
          <p className={cn('text-sm', night ? 'text-talya-cream/70' : 'text-[#2d2640]/65')}>
            Güvenli alan — burada yargı yok.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={night}
          onClick={() => onNightChange(!night)}
          className={cn(
            neumoBtn,
            'px-4 py-2 text-xs',
            night && 'bg-talya-midnight text-talya-cream shadow-orb-midnight ring-1 ring-talya-lavender/40',
          )}
        >
          {night ? 'Gece modu' : 'Gündüz'}
        </button>
      </div>

      <div
        className={cn(
          'relative flex flex-col items-center justify-center py-8',
          night ? 'text-talya-cream' : '',
        )}
      >
        <div
          className={cn(
            'pointer-events-none absolute h-56 w-56 rounded-full border-2 opacity-40 animate-ring-expand',
            night ? 'border-talya-blush/50' : 'border-talya-lavender/40',
          )}
        />
        <div
          className="pointer-events-none absolute h-48 w-48 rounded-full border border-talya-mint/30 opacity-30 animate-ring-expand"
          style={{ animationDelay: '1.2s' }}
        />
        <div
          className={cn(
            'relative flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br shadow-orb animate-orb-breathe',
            night ? 'from-talya-lavender/90 via-talya-midnight to-talya-blush/50 shadow-orb-midnight' : 'from-talya-blush via-talya-lavender to-talya-mint',
          )}
        >
          <span className="font-serif text-lg font-medium text-white drop-shadow-md">
            {phase === 'in' ? 'Nefes al' : 'Ver'}
          </span>
        </div>
        <p className={cn('mt-4 text-sm', night ? 'text-talya-cream/75' : 'text-[#2d2640]/65')}>
          {phase === 'in' ? 'Yavaşça burnundan doldur…' : 'Ağzından yavaşça bırak…'}
        </p>
      </div>

      <div className={cn(glassCard, 'p-5', night && 'border-white/10 bg-white/5 text-talya-cream backdrop-blur-xl')}>
        <h2 className={cn('text-sm font-semibold', night ? 'text-talya-cream' : 'text-[#2d2640]')}>
          Düşüncelerini bırak
        </h2>
        <p className={cn('mt-1 text-xs', night ? 'text-talya-cream/65' : 'text-[#2d2640]/60')}>
          Bu alan çıkınca temizlenir; kaydedilmez.
        </p>
        <textarea
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          rows={4}
          placeholder="Kafandakileri dök…"
          className={cn(
            'mt-3 w-full resize-none rounded-2xl border px-3 py-2 text-sm outline-none focus:ring-2',
            night
              ? 'border-white/15 bg-talya-midnight/60 text-talya-cream placeholder:text-talya-cream/35 focus:ring-talya-lavender/50'
              : 'border-talya-lavender/20 bg-white/50 text-[#2d2640] placeholder:text-[#2d2640]/40 focus:ring-talya-mint',
          )}
        />
      </div>

      <div className="px-2 pb-4">
        <h2 className={cn('mb-2 text-xs font-semibold uppercase tracking-widest', night ? 'text-talya-blush' : 'text-talya-lavender')}>
          {night ? 'Gece onayları' : 'Gündüz onayları'}
        </h2>
        <ul className="space-y-2">
          {affirmations.map((line) => (
            <li
              key={line}
              className={cn(
                'font-serif text-lg italic leading-snug',
                night ? 'text-talya-cream/90' : 'text-[#2d2640]/85',
              )}
            >
              “{line}”
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
