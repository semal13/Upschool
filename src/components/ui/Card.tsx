import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type CardProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
}

export function Card({ children, className, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-talya-sage/10 backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
