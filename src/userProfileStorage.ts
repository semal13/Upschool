export type Symptom = 'insulin' | 'acne' | 'cycle' | 'mood' | 'fatigue'

export type Lifestyle =
  | 'student_dorm'
  | 'student_home'
  | 'working_outside'
  | 'work_from_home_housewife'

export type Budget = 'student_friendly' | 'budget_focus' | 'no_budget_issue'

export interface UserProfile {
  schemaVersion: 4
  name: string
  symptoms: Symptom[]
  lifestyle: Lifestyle
  budget: Budget
  /** Approximate cycle day 1–35 (self-reported) */
  cycleDay: number
  onboardedAt: string
}

const STORAGE_KEY = 'talya:user-profile'

function isV4(data: unknown): data is UserProfile {
  if (!data || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  return (
    o.schemaVersion === 4 &&
    typeof o.name === 'string' &&
    o.name.trim().length > 0 &&
    Array.isArray(o.symptoms) &&
    o.symptoms.every((s) => typeof s === 'string') &&
    typeof o.lifestyle === 'string' &&
    typeof o.budget === 'string' &&
    typeof o.cycleDay === 'number' &&
    Number.isFinite(o.cycleDay) &&
    typeof o.onboardedAt === 'string'
  )
}

function isV3Shape(data: unknown): data is {
  schemaVersion: 3
  name: string
  mainStruggle: string
  lifestyleBudget: string
  cycleDay: number
  onboardedAt: string
} {
  if (!data || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  return (
    o.schemaVersion === 3 &&
    typeof o.name === 'string' &&
    typeof o.mainStruggle === 'string' &&
    typeof o.lifestyleBudget === 'string' &&
    typeof o.cycleDay === 'number' &&
    Number.isFinite(o.cycleDay) &&
    typeof o.onboardedAt === 'string'
  )
}

function isV2Shape(data: unknown): data is {
  schemaVersion: 2
  name: string
  pcosChallenge: string
  lifestyle: string
  cyclePhase: string
  onboardedAt: string
} {
  if (!data || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  // V2 kaydında cycleDay yoktu; eski akış cyclePhase ile ilerliyordu.
  return (
    o.schemaVersion === 2 &&
    typeof o.name === 'string' &&
    typeof o.pcosChallenge === 'string' &&
    typeof o.lifestyle === 'string' &&
    typeof o.cyclePhase === 'string' &&
    typeof o.onboardedAt === 'string'
  )
}

function mapMainStruggleToSymptoms(mainStruggle: string): Symptom[] {
  switch (mainStruggle) {
    case 'insulin':
      return ['insulin']
    case 'acne':
      return ['acne']
    case 'cycle':
      return ['cycle']
    case 'mood':
      return ['mood']
    default:
      return ['fatigue']
  }
}

function mapLifestyleBudgetToLifestyle(lifestyleBudget: string): Lifestyle {
  // V3 kaydı yaşam tarzını ayrıştırmadığı için varsayım yapıyoruz.
  if (lifestyleBudget === 'student_friendly') return 'student_dorm'
  return 'student_home'
}

function mapLifestyleBudgetToBudget(lifestyleBudget: string): Budget {
  if (lifestyleBudget === 'student_friendly') return 'student_friendly'
  return 'budget_focus'
}

function estimateCycleDayFromCyclePhase(cyclePhase: string): number {
  // Kaba eşleme (V2’de cycleDay yoktu).
  switch (cyclePhase) {
    case 'menstrual':
      return 2
    case 'follicular':
      return 7
    case 'ovulation':
      return 14
    case 'luteal':
      return 22
    default:
      return 10
  }
}

function mapV2ToV4(v2: Record<string, unknown>): UserProfile {
  const pcosChallenge = typeof v2.pcosChallenge === 'string' ? v2.pcosChallenge : ''
  const lifestyleRaw = typeof v2.lifestyle === 'string' ? v2.lifestyle : ''
  const cyclePhase = typeof v2.cyclePhase === 'string' ? v2.cyclePhase : ''
  const name = typeof v2.name === 'string' ? v2.name : ''
  const onboardedAt = typeof v2.onboardedAt === 'string' ? v2.onboardedAt : new Date().toISOString()

  const symptoms: Symptom[] =
    pcosChallenge === 'weight'
      ? ['insulin']
      : pcosChallenge === 'skin_hair'
        ? ['acne']
        : pcosChallenge === 'irregular_cycle'
          ? ['cycle']
          : pcosChallenge === 'binge'
            ? ['mood']
            : pcosChallenge === 'fertility'
              ? ['mood']
              : ['fatigue']

  const lifestyle: Lifestyle =
    lifestyleRaw === 'tight_budget' || lifestyleRaw === 'student'
      ? 'student_dorm'
      : lifestyleRaw === 'student_and_budget'
        ? 'student_home'
        : 'student_home'

  const budget: Budget = lifestyleRaw === 'tight_budget' ? 'budget_focus' : 'student_friendly'

  return {
    schemaVersion: 4,
    name,
    symptoms,
    lifestyle,
    budget,
    cycleDay: estimateCycleDayFromCyclePhase(cyclePhase),
    onboardedAt,
  }
}

export function loadUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as unknown
    if (isV4(data)) return data
    if (isV3Shape(data)) {
      const v4: UserProfile = {
        schemaVersion: 4,
        name: data.name,
        symptoms: mapMainStruggleToSymptoms(data.mainStruggle),
        lifestyle: mapLifestyleBudgetToLifestyle(data.lifestyleBudget),
        budget: mapLifestyleBudgetToBudget(data.lifestyleBudget),
        cycleDay: data.cycleDay,
        onboardedAt: data.onboardedAt,
      }
      return v4
    }
    if (isV2Shape(data)) return mapV2ToV4(data)
    return null
  } catch {
    return null
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function clearUserProfile(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/** Varsayılan döngü uzunluğu (tahmini sonraki regl) */
const DEFAULT_CYCLE_LEN = 28

export function predictNextPeriodLabel(cycleDay: number): string {
  const d = Math.max(1, Math.min(35, Math.round(cycleDay)))
  const capped = Math.min(d, DEFAULT_CYCLE_LEN - 1)
  const remaining = Math.max(1, DEFAULT_CYCLE_LEN - capped)
  const next = new Date()
  next.setDate(next.getDate() + remaining)
  return `Tahmini sonraki regl: ~${remaining} gün içinde (${next.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}). Kişisel doğrulama için doktorunu kullan.`
}

