// Secure random helpers (crypto.getRandomValues). No Math.random.
const MAX32 = 2 ** 32
export function randInt(min, max) {
  const range = max - min + 1
  if (!Number.isInteger(range) || range < 1 || range > MAX32) throw new Error('Range is too large.')
  if (range === 1) return min
  const lim = Math.floor(MAX32 / range) * range
  const buf = new Uint32Array(1)
  let x
  do { crypto.getRandomValues(buf); x = buf[0] } while (x >= lim)
  return min + (x % range)
}
export function randUnit() {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] / MAX32
}
export function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) { const j = randInt(0, i); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
export const pickOne = (list) => list[randInt(0, list.length - 1)]

// Parse a multi-line options box: one option per line, blanks removed, duplicates (ignoring case) dropped.
export function parseOptions(text) {
  const seen = new Set()
  const out = []
  for (const line of String(text).split('\n')) {
    const t = line.trim()
    if (t && !seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); out.push(t) }
  }
  return out
}

// opts: {min, max, count, decimals, unique, sort} (numbers already parsed). Returns array of strings.
export function randomNumbers({ min, max, count, decimals, unique, sort }) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) throw new Error('Enter both a minimum and a maximum.')
  if (Math.abs(min) > 1e9 || Math.abs(max) > 1e9) throw new Error('Use values between -1,000,000,000 and 1,000,000,000.')
  if (min > max) throw new Error('Minimum cannot be greater than maximum.')
  if (!Number.isInteger(count) || count < 1 || count > 1000) throw new Error('Count must be a whole number from 1 to 1000.')
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 6) throw new Error('Decimal places must be a whole number from 0 to 6.')
  let out = []
  if (decimals === 0) {
    if (!Number.isInteger(min) || !Number.isInteger(max)) throw new Error('For whole numbers, minimum and maximum must be whole numbers.')
    const range = max - min + 1
    if (unique && count > range) throw new Error(`Only ${range} different whole numbers exist in that range, so ${count} unique numbers is not possible.`)
    if (unique) {
      const seen = new Set()
      while (seen.size < count) seen.add(randInt(min, max))
      out = [...seen]
    } else out = Array.from({ length: count }, () => randInt(min, max))
    if (sort) out.sort((a, b) => a - b)
    return out.map(String)
  }
  const one = () => (min + randUnit() * (max - min)).toFixed(decimals)
  if (unique) {
    const seen = new Set()
    let tries = 0
    while (seen.size < count && tries < count * 50 + 200) { seen.add(one()); tries++ }
    if (seen.size < count) throw new Error('Could not find that many unique values. Widen the range or use more decimal places.')
    out = [...seen]
  } else out = Array.from({ length: count }, one)
  if (sort) out.sort((a, b) => a - b)
  return out
}
