import { useState } from 'react'
import { cn } from '../lib/cn'
import { glassCard, neumoBtnSm } from '../ui/glass'

const MODULES = [
  {
    id: 'what',
    title: 'PCOS nedir?',
    body: 'Polikistik over sendromu, hormonal ve metabolik bulgularla ortaya çıkan bir durumdur. Tek tip değildir; tanı ve tedavi kişiye özeldir.',
  },
  {
    id: 'signs',
    title: 'Yaygın belirtiler',
    body: 'Düzensiz adet, androjen belirtileri (akne, tüylenme), insülin direnci eğilimi görülebilir. Herkesde hepsi olmayabilir.',
  },
  {
    id: 'care',
    title: 'Öz-bakım neden önemli?',
    body: 'Uyku, stres, beslenme ve hareket yaşam kalitesini doğrudan etkiler. Talya tıbbi tanı koymaz; doktorunla birlikte ilerle.',
  },
]

const READING = [
  { title: 'WHO — Üreme sağlığı özetleri', href: 'https://www.who.int' },
  { title: 'PCOS topluluk kaynakları (İng.)', href: 'https://www.pcosaa.org' },
]

export function EducationCenter() {
  const [open, setOpen] = useState<string | null>('what')

  return (
    <div className="flex flex-col gap-4 pb-4">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-[#2d2640]">Eğitim merkezi</h1>
        <p className="mt-1 text-sm text-[#2d2640]/65">
          Bilgilendirme amaçlıdır; tıbbi tavsiye yerine geçmez.
        </p>
      </header>

      <ul className="flex flex-col gap-2">
        {MODULES.map((m) => {
          const isOpen = open === m.id
          return (
            <li key={m.id} className={cn(glassCard, 'overflow-hidden')}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                onClick={() => setOpen(isOpen ? null : m.id)}
                aria-expanded={isOpen}
              >
                <span className="font-medium text-[#2d2640]">{m.title}</span>
                <span className="text-talya-lavender">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="border-t border-white/40 px-4 py-3 text-sm leading-relaxed text-[#2d2640]/80">
                  {m.body}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <section className={cn(glassCard, 'p-5')}>
        <h2 className="text-sm font-semibold text-[#2d2640]">Önerilen okumalar</h2>
        <ul className="mt-3 space-y-2">
          {READING.map((r) => (
            <li key={r.title}>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 rounded-xl bg-white/40 px-3 py-2 text-sm text-talya-lavender underline-offset-2 hover:underline"
              >
                {r.title}
                <span className={neumoBtnSm}>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
