import { cn } from '../lib/cn'

export const glassCard = cn(
  'rounded-bento border border-white/50 bg-white/40 backdrop-blur-xl shadow-glass',
)

export const neumoBtn = cn(
  'rounded-2xl bg-talya-cream font-medium text-[#2d2640] shadow-neumo transition',
  'active:shadow-neumo-press hover:brightness-[1.02]',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-talya-lavender focus-visible:outline-offset-2',
)

export const neumoBtnSm = cn(neumoBtn, 'px-3 py-2 text-sm')
