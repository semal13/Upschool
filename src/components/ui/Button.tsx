import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: ReactNode
  variant?: Variant
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const variants: Record<Variant, string> = {
  primary:
    'bg-talya-sage text-white shadow-sm hover:bg-talya-sage-deep active:scale-[0.99] disabled:opacity-50',
  secondary:
    'bg-white text-talya-forest shadow-sm ring-1 ring-talya-sage/25 hover:bg-talya-cream active:scale-[0.99]',
  ghost: 'text-talya-forest hover:bg-talya-sage/15',
}

export function Button({ children, variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'rounded-3xl px-5 py-3.5 text-center text-sm font-semibold transition-all duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-talya-sage',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
