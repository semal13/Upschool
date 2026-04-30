export type CircleCategory = 'nutrition' | 'emotional' | 'win'

export type CirclePost = {
  id: string
  body: string
  category: CircleCategory
  anonymous: boolean
  displayName: string
  highFives: number
  createdAt: string
  aiModerationNote: string
}

const KEY = 'talya:circle-posts'

const seed: CirclePost[] = [
  {
    id: 'seed-1',
    body: 'Bugün kendime yumuşak davrandım; regl gününde yürüyüşe çıktım.',
    category: 'emotional',
    anonymous: true,
    displayName: 'Yıldız',
    highFives: 12,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    aiModerationNote: 'Talya AI: Destekleyici ve güvenli.',
  },
  {
    id: 'seed-2',
    body: 'Düşük maliyetli mercimek salatası yaptım — öğrenci bütçesine uygun.',
    category: 'nutrition',
    anonymous: false,
    displayName: 'Deniz',
    highFives: 8,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    aiModerationNote: 'Talya AI: Beslenme ipucu, yanıltıcı iddia yok.',
  },
]

export function loadCirclePosts(): CirclePost[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return [...seed]
    const list = JSON.parse(raw) as CirclePost[]
    if (!Array.isArray(list)) return [...seed]
    return list
  } catch {
    return [...seed]
  }
}

export function saveCirclePosts(posts: CirclePost[]): void {
  localStorage.setItem(KEY, JSON.stringify(posts))
}
