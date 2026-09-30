// Date and time-zone helpers. Everything uses the browser's built-in Intl data; nothing is fetched.

// ---- calendar-day helpers (local dates as YYYY-MM-DD strings) ----
export const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const ymd = (s) => s.split('-').map(Number)
export const shiftDay = (s, n) => { const [y, m, d] = ymd(s); return iso(new Date(y, m - 1, d + n)) }
export const dayLabel = (s, opts = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) => {
  const [y, m, d] = ymd(s)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, opts)
}
export const validDay = (s) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return false; const [y, m, d] = ymd(s); return iso(new Date(y, m - 1, d)) === s }
// First day of the week containing `s`. startDay: 1 = Monday, 0 = Sunday.
export function weekStart(s, startDay = 1) {
  const [y, m, d] = ymd(s)
  const dow = new Date(y, m - 1, d).getDay()
  return shiftDay(s, -((dow - startDay + 7) % 7))
}

// ---- habit statistics; log is {'YYYY-MM-DD': true} ----
export function streaks(log, todayStr) {
  let cur = 0
  let d = log[todayStr] ? todayStr : shiftDay(todayStr, -1) // today not ticked yet does not break a streak
  while (log[d]) { cur++; d = shiftDay(d, -1) }
  const days = Object.keys(log).filter((k) => log[k]).sort()
  let best = 0, run = 0, prev = null
  for (const k of days) {
    run = prev && shiftDay(prev, 1) === k ? run + 1 : 1
    if (run > best) best = run
    prev = k
  }
  return { current: cur, best }
}
export function completion(log, todayStr, days = 30) {
  let n = 0
  for (let i = 0; i < days; i++) if (log[shiftDay(todayStr, -i)]) n++
  return Math.round((n / days) * 100)
}

// ---- time zones ----
const FALLBACK = ['UTC', 'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi', 'America/Anchorage', 'America/Argentina/Buenos_Aires', 'America/Bogota', 'America/Chicago', 'America/Denver', 'America/Halifax', 'America/Los_Angeles', 'America/Mexico_City', 'America/New_York', 'America/Sao_Paulo', 'America/Toronto', 'America/Vancouver', 'Asia/Bangkok', 'Asia/Dhaka', 'Asia/Dubai', 'Asia/Hong_Kong', 'Asia/Jakarta', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Manila', 'Asia/Riyadh', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tehran', 'Asia/Tokyo', 'Atlantic/Reykjavik', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney', 'Europe/Amsterdam', 'Europe/Berlin', 'Europe/Istanbul', 'Europe/London', 'Europe/Madrid', 'Europe/Moscow', 'Europe/Paris', 'Europe/Rome', 'Pacific/Auckland', 'Pacific/Honolulu']
export function zoneList() {
  let z = []
  try { z = Intl.supportedValuesOf('timeZone') } catch { /* older browser */ }
  if (!z.length) z = FALLBACK
  return z.includes('UTC') ? z : ['UTC', ...z]
}
export const localZone = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' } catch { return 'UTC' } }
export const zoneName = (z) => z.split('/').pop().replace(/_/g, ' ')
export const zoneOk = (z) => { try { new Intl.DateTimeFormat('en-US', { timeZone: z }); return true } catch { return false } }

export function zoneParts(date, zone) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const o = {}
  for (const p of f.formatToParts(date)) o[p.type] = p.value
  return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, mi: +o.minute, s: +o.second }
}
// Offset of `zone` from UTC at instant `date`, in milliseconds.
export function offsetMs(date, zone) {
  const p = zoneParts(date, zone)
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(date.getTime() / 1000) * 1000
}
export function fmtOffset(ms) {
  const sign = ms < 0 ? '-' : '+'
  const mins = Math.round(Math.abs(ms) / 60000)
  const h = Math.floor(mins / 60), m = mins % 60
  return `UTC${sign}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`
}
// Wall-clock time in `zone` -> real instant. Returns {date, exists, ambiguous}.
export function zonedToUtc(y, m, d, h, mi, zone) {
  const guess = Date.UTC(y, m - 1, d, h, mi, 0)
  let t = guess - offsetMs(new Date(guess), zone)
  t = guess - offsetMs(new Date(t), zone)
  const date = new Date(t)
  const p = zoneParts(date, zone)
  const exists = p.y === y && p.m === m && p.d === d && p.h === h && p.mi === mi
  // A wall time is ambiguous when an hour earlier or later gives the same wall time (clock moved back).
  const alt = (dt) => { const q = zoneParts(dt, zone); return q.y === y && q.m === m && q.d === d && q.h === h && q.mi === mi }
  const ambiguous = exists && (alt(new Date(t - 3600000)) || alt(new Date(t + 3600000)))
  return { date, exists, ambiguous }
}
export function fmtZoned(date, zone, hour12 = false) {
  return new Intl.DateTimeFormat(undefined, { timeZone: zone, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12 }).format(date)
}
export const fmtClock = (date, zone, hour12, seconds = true) =>
  new Intl.DateTimeFormat(undefined, { timeZone: zone, hour: '2-digit', minute: '2-digit', ...(seconds ? { second: '2-digit' } : {}), hour12 }).format(date)
export const fmtDate = (date, zone) =>
  new Intl.DateTimeFormat(undefined, { timeZone: zone, weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }).format(date)
// Calendar-day difference of `date` in `zone` versus the same instant in `baseZone`.
export function dayDiff(date, zone, baseZone) {
  const a = zoneParts(date, zone), b = zoneParts(date, baseZone)
  return Math.round((Date.UTC(a.y, a.m - 1, a.d) - Date.UTC(b.y, b.m - 1, b.d)) / 86400000)
}
