import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
  stepIndex: number
  totalSteps: number
  footer?: ReactNode
  className?: string
}

export function OnboardingStep({
  title,
  subtitle,
  children,
  stepIndex,
  totalSteps,
  footer,
  className,
}: Props) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col animate-fade-in', className)}>
      <div className="shrink-0 px-1 pt-2">
        <h1 className="text-xl font-semibold leading-tight text-talya-forest sm:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm font-medium text-talya-forest/70">{subtitle}</p> : null}
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-1 pb-4">{children}</div>

      <div className="shrink-0 space-y-5 border-t border-talya-sage/10 bg-talya-cream/50 px-1 pb-6 pt-5">
        <div className="flex justify-center gap-2" role="tablist" aria-label="İlerleme">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-300',
                i === stepIndex ? 'w-6 bg-talya-sage' : 'bg-talya-sage/30',
              )}
              aria-current={i === stepIndex ? 'step' : undefined}
            />
          ))}
        </div>
        {footer}
      </div>
    </div>
  )
}
