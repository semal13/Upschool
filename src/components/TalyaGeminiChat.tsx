import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'
import { getGeminiApiKey, streamTalyaReply } from '../services/geminiService.js'

type Msg = { role: 'user' | 'assistant'; text: string }

type Props = {
  open: boolean
  onClose: () => void
}

export function TalyaGeminiChat({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const listEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = useCallback(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streaming, scrollToBottom])

  function close() {
    abortRef.current?.abort()
    abortRef.current = null
    setStreaming('')
    setBusy(false)
    onClose()
  }

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    if (!getGeminiApiKey()) {
      setError(
        'Gemini API anahtarı yok. .env dosyasına VITE_GEMINI_API_KEY ekle.',
      )
      return
    }

    setError(null)
    setInput('')
    const nextUser: Msg = { role: 'user', text }
    const historyBase = [...messages, nextUser]
    setMessages(historyBase)
    setBusy(true)
    setStreaming('')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      let acc = ''
      await streamTalyaReply(messages, text, {
        signal: controller.signal,
        onChunk: (c) => {
          acc += c
          setStreaming(acc)
        },
      })
      setStreaming('')
      setMessages((prev) => [...prev, { role: 'assistant', text: acc }])
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        setStreaming('')
      } else {
        const msg = e instanceof Error ? e.message : 'Bir hata oluştu.'
        setError(msg)
        setMessages((m) => m.slice(0, -1))
      }
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="talya-chat-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-talya-lavender/25 backdrop-blur-sm"
        onClick={close}
        aria-label="Kapat"
      />

      <div
        className={cn(
          'relative z-10 flex max-h-[min(88dvh,640px)] w-full max-w-md flex-col overflow-hidden',
          'rounded-3xl border border-talya-lavender/30 bg-gradient-to-b from-talya-cream via-white/90 to-talya-blush/30',
          'shadow-[0_24px_80px_-12px_rgba(142,125,190,0.35)]',
        )}
      >
        <header className="flex items-center justify-between gap-2 border-b border-talya-lavender/15 bg-white/40 px-4 py-3 backdrop-blur-md">
          <div>
            <h2 id="talya-chat-title" className="font-serif text-lg font-semibold text-[#2d2640]">
              Talya ile sohbet
            </h2>
            <p className="text-xs text-talya-lavender">Şefkatli yoldaşın · Tıbbi teşhis değil</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-2xl bg-talya-cream px-3 py-1.5 text-sm font-medium text-[#2d2640] shadow-neumo active:shadow-neumo-press"
          >
            Kapat
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 && !streaming ? (
            <p className="rounded-2xl bg-white/50 px-3 py-2 text-sm text-[#2d2640]/75">
              Merhaba, ben Talya. Nasılsın? Bugün aklında ne var?
            </p>
          ) : null}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                'max-w-[92%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed shadow-sm',
                m.role === 'user'
                  ? 'ml-auto bg-talya-lavender/25 text-[#2d2640]'
                  : 'mr-auto border border-talya-mint/40 bg-white/70 text-[#2d2640]',
              )}
            >
              {m.text}
            </div>
          ))}

          {streaming ? (
            <div className="mr-auto max-w-[92%] rounded-2xl border border-talya-mint/40 bg-white/70 px-3 py-2.5 text-sm leading-relaxed text-[#2d2640] shadow-sm">
              {streaming}
              <span className="ml-0.5 inline-block h-3 w-1 animate-pulse rounded-full bg-talya-lavender align-middle" />
            </div>
          ) : null}

          {busy && !streaming ? (
            <p className="text-xs text-talya-lavender">Talya düşünüyor…</p>
          ) : null}

          {error ? (
            <p className="rounded-2xl border border-talya-blush bg-talya-blush/40 px-3 py-2 text-sm text-[#2d2640]" role="alert">
              {error}
            </p>
          ) : null}

          <div ref={listEndRef} />
        </div>

        <footer className="border-t border-talya-lavender/15 bg-talya-cream/80 p-3 backdrop-blur-md">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void send()
                }
              }}
              rows={2}
              disabled={busy}
              placeholder="Mesajını yaz…"
              className="min-h-[44px] flex-1 resize-none rounded-2xl border border-talya-lavender/20 bg-white/80 px-3 py-2 text-sm text-[#2d2640] outline-none focus:ring-2 focus:ring-talya-lavender/40 disabled:opacity-60"
            />
            <button
              type="button"
              disabled={busy || !input.trim()}
              onClick={() => void send()}
              className={cn(
                'shrink-0 self-end rounded-2xl bg-talya-lavender px-4 py-2.5 text-sm font-semibold text-white shadow-md',
                'transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              Gönder
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
