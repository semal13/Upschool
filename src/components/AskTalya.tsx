import { useState } from 'react'
import { cn } from '../lib/cn'
import { glassCard, neumoBtn } from '../ui/glass'

const PLACEHOLDER_REPLIES = [
  'Burada yargı yok. Şu an neye ihtiyacın var — sakinleşmek mi, plan yapmak mı?',
  'Duyguların geçerli. İstersen tek bir küçük adım seçelim: su, kısa yürüyüş veya 3 nefes.',
  'Tıbbi kararlar için mutlaka doktoruna danış; ben duygusal ve pratik eşlik sunarım.',
]

type Props = { open: boolean; onClose: () => void }

export function AskTalyaBubble({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full',
        'bg-gradient-to-br from-talya-lavender to-talya-blush text-lg text-white shadow-orb',
        'transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-talya-lavender',
      )}
      aria-label="Talya’ya sor"
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/50 opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
      </span>
    </button>
  )
}

export function AskTalyaPanel({ open, onClose }: Props) {
  const [msg, setMsg] = useState('')
  const [reply, setReply] = useState<string | null>(null)

  if (!open) return null

  function close() {
    setMsg('')
    setReply(null)
    onClose()
  }

  function send() {
    if (!msg.trim()) return
    const pick = PLACEHOLDER_REPLIES[Math.floor(Math.random() * PLACEHOLDER_REPLIES.length)]
    setReply(pick)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="ask-talya-title">
      <button type="button" className="absolute inset-0 bg-talya-midnight/40 backdrop-blur-sm" onClick={close} aria-label="Kapat" />
      <div className={cn(glassCard, 'relative z-10 w-full max-w-md p-5 shadow-orb')}>
        <div className="flex items-start justify-between gap-2">
          <h2 id="ask-talya-title" className="font-serif text-xl font-semibold text-[#2d2640]">
            Talya ile konuş
          </h2>
          <button type="button" className={cn(neumoBtn, 'px-3 py-1 text-sm')} onClick={close}>
            ✕
          </button>
        </div>
        <p className="mt-1 text-xs text-[#2d2640]/60">
          7/24 empatik eşlik (MVP: yerel yanıtlar). Tıbbi teşhis veya tedavi önerisi vermem.
        </p>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
          className="mt-3 w-full resize-none rounded-2xl border border-talya-lavender/25 bg-white/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-talya-mint"
          placeholder="Bugün aklında ne var?"
        />
        <button type="button" className={cn(neumoBtn, 'mt-3 w-full py-3')} onClick={send}>
          Gönder
        </button>
        {reply && (
          <p className="mt-3 rounded-2xl border border-talya-mint/40 bg-talya-mint/20 p-3 text-sm leading-relaxed text-[#2d2640]">
            {reply}
          </p>
        )}
      </div>
    </div>
  )
}
