import { cn } from '../../lib/cn'

type Props = {
  role: 'user' | 'assistant'
  children: string
  streaming?: boolean
}

export function ChatMessage({ role, children, streaming }: Props) {
  const isUser = role === 'user'
  return (
    <div
      className={cn(
        'max-w-[88%] min-h-[44px] rounded-3xl px-4 py-3 text-sm font-medium leading-relaxed shadow-sm',
        isUser
          ? 'ml-auto bg-talya-sage text-white'
          : 'mr-auto bg-stone-100/95 text-talya-forest ring-1 ring-stone-200/80',
      )}
    >
      {children}
      {streaming ? (
        <span className="ml-1 inline-block h-2 w-0.5 animate-pulse rounded-full bg-current align-middle opacity-70" />
      ) : null}
    </div>
  )
}
