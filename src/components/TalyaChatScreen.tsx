import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'
import { getGroqApiKey, streamTalyaReply } from '../services/groqService.js'
import { ChatMessage } from './ui/ChatMessage'

type Msg = { role: 'user' | 'assistant'; text: string }

type Props = {
  onBack: () => void
}

export function TalyaChatScreen({ onBack }: Props) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const listEndRef = useRef<HTMLDivElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const scrollToBottom = useCallback(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streaming, scrollToBottom])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    if (!getGroqApiKey()) {
      setError('Groq API anahtarı yok. src/services/groqService.js içinde GROQ_API_KEY alanına kendi key’ini ekle.')
      return
    }

    setError(null)
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text }])
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

  function handleBack() {
    abortRef.current?.abort()
    abortRef.current = null
    onBack()
  }

  return (
    <div className="animate-fade-in flex min-h-dvh flex-col bg-talya-cream">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-talya-sage/15 bg-talya-cream/95 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-talya-forest ring-1 ring-talya-sage/20 hover:bg-talya-sage/10"
          aria-label="Geri"
        >
          ←
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold text-talya-forest">Talya</h1>
            <span className="flex items-center gap-1.5 rounded-full bg-talya-sage/15 px-2 py-0.5 text-xs font-semibold text-talya-sage-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-talya-sage" aria-hidden />
              Çevrimiçi
            </span>
          </div>
          <p className="truncate text-xs font-medium text-talya-forest/55">Şefkatli yoldaşın · Tıbbi teşhis değil</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !streaming ? (
          <ChatMessage role="assistant">
            Merhaba, ben Talya. Buradayım — bugün aklında ne var?
          </ChatMessage>
        ) : null}

        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role === 'user' ? 'user' : 'assistant'}>
            {m.text}
          </ChatMessage>
        ))}

        {streaming ? (
          <ChatMessage role="assistant" streaming>
            {streaming}
          </ChatMessage>
        ) : null}

        {busy && !streaming ? (
          <p className="text-center text-xs font-medium text-talya-forest/50">Talya yazıyor…</p>
        ) : null}

        {error ? (
          <p className="rounded-3xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        <div ref={listEndRef} />
      </div>

      <footer className="sticky bottom-0 border-t border-talya-sage/15 bg-white/90 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-end gap-2 rounded-3xl bg-white px-2 py-2 shadow-sm ring-1 ring-talya-sage/15">
          <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf" aria-hidden />
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-talya-forest/60 hover:bg-talya-sage/10"
            aria-label="Ek ekle"
            onClick={() => fileRef.current?.click()}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send()
              }
            }}
            rows={1}
            disabled={busy}
            placeholder="Mesajın…"
            className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-sm font-medium text-talya-forest outline-none placeholder:text-talya-forest/35 disabled:opacity-50"
          />
          <button
            type="button"
            disabled={busy || !input.trim()}
            onClick={() => void send()}
            className={cn(
              'mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-talya-sage text-white shadow-sm transition',
              'hover:bg-talya-sage-deep disabled:cursor-not-allowed disabled:opacity-40',
            )}
            aria-label="Gönder"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  )
}
