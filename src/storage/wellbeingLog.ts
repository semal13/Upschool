const KEY = 'talya:wellbeing-log'

export type WellbeingLog = {
  /** YYYY-MM-DD — semptom notunun ait olduğu gün */
  date: string
  summary: string
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function loadWellbeingLog(): WellbeingLog | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<WellbeingLog>
    if (typeof data.date !== 'string' || typeof data.summary !== 'string') return null
    return { date: data.date, summary: data.summary }
  } catch {
    return null
  }
}

export function saveWellbeingLog(summary: string): void {
  const entry: WellbeingLog = { date: todayKey(), summary: summary.trim() }
  localStorage.setItem(KEY, JSON.stringify(entry))
}

/** Özet kartı için: dün kayıtlıysa onu, yoksa son kaydı kısaca göster */
export function getYesterdaySymptomSummary(): string {
  const log = loadWellbeingLog()
  if (!log?.summary) return 'Henüz dün için kayıt yok — “Semptom kaydı” ile ekleyebilirsin.'
  const y = yesterdayKey()
  if (log.date === y) return log.summary
  if (log.date === todayKey()) return `Bugün: ${log.summary}`
  return `Son kayıt (${log.date}): ${log.summary}`
}
