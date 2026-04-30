const WATER_KEY = 'talya:daily-water'
const STEPS_KEY = 'talya:daily-steps'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export type WaterState = {
  date: string
  liters: number
  goal: 1.4 | 2.5
}

export function loadWater(): WaterState {
  try {
    const raw = localStorage.getItem(WATER_KEY)
    if (!raw) throw new Error('empty')
    const data = JSON.parse(raw) as Partial<WaterState>
    const date = typeof data.date === 'string' ? data.date : ''
    if (date !== todayKey()) {
      return { date: todayKey(), liters: 0, goal: data.goal === 1.4 ? 1.4 : 2.5 }
    }
    return {
      date: todayKey(),
      liters: typeof data.liters === 'number' ? Math.max(0, data.liters) : 0,
      goal: data.goal === 1.4 ? 1.4 : 2.5,
    }
  } catch {
    return { date: todayKey(), liters: 0, goal: 2.5 }
  }
}

export function saveWater(state: WaterState): void {
  localStorage.setItem(WATER_KEY, JSON.stringify({ ...state, date: todayKey() }))
}

export type StepsState = {
  date: string
  steps: number
}

export function loadSteps(): StepsState {
  try {
    const raw = localStorage.getItem(STEPS_KEY)
    if (!raw) throw new Error('empty')
    const data = JSON.parse(raw) as Partial<StepsState>
    if (data.date !== todayKey()) {
      return { date: todayKey(), steps: typeof data.steps === 'number' ? data.steps : 6420 }
    }
    return {
      date: todayKey(),
      steps: typeof data.steps === 'number' ? Math.max(0, data.steps) : 6420,
    }
  } catch {
    return { date: todayKey(), steps: 6420 }
  }
}

export function saveSteps(state: StepsState): void {
  localStorage.setItem(STEPS_KEY, JSON.stringify({ ...state, date: todayKey() }))
}
