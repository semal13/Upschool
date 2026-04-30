import { cn } from '../lib/cn'

export type AppTab = 'dashboard' | 'sanctuary' | 'circle' | 'lifestyle' | 'education'

const ITEMS: { id: AppTab; label: string; emoji: string }[] = [
  { id: 'dashboard', label: 'Ana', emoji: '🏠' },
  { id: 'sanctuary', label: 'Sığınak', emoji: '🌙' },
  { id: 'circle', label: 'Çember', emoji: '💜' },
  { id: 'lifestyle', label: 'Yaşam', emoji: '🥗' },
  { id: 'education', label: 'Öğren', emoji: '📖' },
]

type Props = {
  active: AppTab
  onChange: (t: AppTab) => void
  midnight?: boolean
}

export function BottomNav({ active, onChange, midnight }: Props) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30 border-t border-white/40 bg-talya-cream/85 px-2 pt-2 backdrop-blur-xl pb-[max(0.75rem,env(safe-area-inset-bottom))]',
        midnight && 'border-white/10 bg-talya-midnight/92 text-talya-cream',
      )}
      aria-label="Ana menü"
    >
      <ul className="mx-auto flex max-w-lg justify-between gap-1">
        {ITEMS.map((item) => (
          <li key={item.id} className="flex-1">
            <button
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                'flex w-full flex-col items-center gap-0.5 rounded-2xl py-2 text-[10px] font-medium transition',
                active === item.id
                  ? midnight
                    ? 'bg-white/10 text-talya-cream shadow-neumo'
                    : 'bg-white/60 text-talya-lavender shadow-neumo'
                  : midnight
                    ? 'text-talya-cream/55'
                    : 'text-[#2d2640]/45',
              )}
            >
              <span className="text-lg leading-none" aria-hidden>
                {item.emoji}
              </span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
