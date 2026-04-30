import { useMemo, useState } from 'react'
import { cn } from '../lib/cn'
import { glassCard, neumoBtn, neumoBtnSm } from '../ui/glass'
import {
  loadCirclePosts,
  saveCirclePosts,
  type CircleCategory,
  type CirclePost,
} from '../storage/circleFeed'
import type { UserProfile } from '../userProfileStorage'

const CATEGORIES: { id: CircleCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'win', label: 'Günlük zafer' },
  { id: 'nutrition', label: 'Beslenme ipuçları' },
  { id: 'emotional', label: 'Duygusal destek' },
]

function moderate(text: string): { ok: boolean; note: string } {
  const lower = text.toLowerCase()
  const risky = ['kesin tedavi', 'ilaç sat', 'kür sat', 'doğurganlık garanti']
  if (risky.some((w) => lower.includes(w))) {
    return {
      ok: false,
      note: 'Talya AI: Bu içerik topluluk güvenliği için yayınlanmadı. Lütfen tıbbi iddialardan kaçın.',
    }
  }
  return {
    ok: true,
    note: 'Talya AI: İçerik güvenli ve destekleyici görünüyor; yine de tıbbi tavsiye değildir.',
  }
}

type Props = { profile: UserProfile }

export function TalyaCircle({ profile }: Props) {
  const [posts, setPosts] = useState<CirclePost[]>(() => loadCirclePosts())
  const [filter, setFilter] = useState<CircleCategory | 'all'>('all')
  const [body, setBody] = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const [category, setCategory] = useState<CircleCategory>('win')
  const [busy, setBusy] = useState(false)
  const [modMsg, setModMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'all') return posts
    return posts.filter((p) => p.category === filter)
  }, [posts, filter])

  function persist(next: CirclePost[]) {
    setPosts(next)
    saveCirclePosts(next)
  }

  function submit() {
    const trimmed = body.trim()
    if (trimmed.length < 3) {
      setModMsg('Birkaç kelime daha ekle; paylaşımın diğerlerine ulaşsın.')
      return
    }
    setBusy(true)
    setModMsg(null)
    window.setTimeout(() => {
      const result = moderate(trimmed)
      if (!result.ok) {
        setModMsg(result.note)
        setBusy(false)
        return
      }
      const post: CirclePost = {
        id: crypto.randomUUID(),
        body: trimmed,
        category,
        anonymous,
        displayName: anonymous ? 'Anonim' : profile.name,
        highFives: 0,
        createdAt: new Date().toISOString(),
        aiModerationNote: result.note,
      }
      setPosts((prev) => {
        const next = [post, ...prev]
        saveCirclePosts(next)
        return next
      })
      setBody('')
      setModMsg('Paylaşıldı. Teşekkürler — çember seninle güçleniyor.')
      setBusy(false)
    }, 600)
  }

  function highFive(id: string) {
    persist(
      posts.map((p) => (p.id === id ? { ...p, highFives: p.highFives + 1 } : p)),
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-[#2d2640]">Talya Çemberi</h1>
        <p className="mt-1 text-sm text-[#2d2640]/65">
          Günlük zaferler ve destek — AI moderasyonlu, yargısız alan.
        </p>
      </header>

      <div className={cn(glassCard, 'p-5')}>
        <label className="text-sm font-semibold text-[#2d2640]">Paylaş</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id as CircleCategory)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition',
                category === c.id
                  ? 'border-talya-lavender bg-talya-blush/40 text-[#2d2640]'
                  : 'border-transparent bg-white/40 text-[#2d2640]/60',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={400}
          placeholder="Bugünkü zaferin veya ihtiyacın olan destek…"
          className="mt-3 w-full resize-none rounded-2xl border border-talya-lavender/20 bg-white/50 px-3 py-2 text-sm text-[#2d2640] outline-none focus:ring-2 focus:ring-talya-mint"
        />
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-[#2d2640]/75">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-4 w-4 accent-talya-lavender"
          />
          Anonim paylaş
        </label>
        <button
          type="button"
          disabled={busy}
          className={cn(neumoBtn, 'mt-4 w-full py-3')}
          onClick={submit}
        >
          {busy ? 'Talya AI inceliyor…' : 'Gönder'}
        </button>
        {modMsg ? (
          <p className="mt-2 text-xs text-talya-lavender" role="status">
            {modMsg}
          </p>
        ) : null}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={cn(
              neumoBtnSm,
              'shrink-0',
              filter === c.id && 'ring-2 ring-talya-lavender/50',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-3">
        {filtered.map((post) => (
          <li key={post.id} className={cn(glassCard, 'p-4')}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-talya-lavender">{post.displayName}</span>
              <time className="text-xs text-[#2d2640]/45" dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString('tr-TR')}
              </time>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#2d2640]/85">{post.body}</p>
            <p className="mt-2 text-[10px] leading-snug text-[#2d2640]/50">{post.aiModerationNote}</p>
            <button
              type="button"
              onClick={() => highFive(post.id)}
              className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white/50 px-3 py-2 text-sm shadow-neumo transition hover:scale-[1.02] active:shadow-neumo-press"
              aria-label="Beşlik"
            >
              <span
                className="text-xl drop-shadow-md"
                style={{ transform: 'perspective(40px) rotateX(8deg)' }}
                aria-hidden
              >
                🙌
              </span>
              <span className="font-medium text-[#2d2640]">{post.highFives} beşlik</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
