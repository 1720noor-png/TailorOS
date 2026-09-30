// Shared number helpers for ToolHub calculators.
// Parses a form value: blank or non-numeric input becomes NaN.
export const num = (v) => (String(v ?? '').trim() === '' ? NaN : Number(v))
// Optional numeric field: blank counts as `def`.
export const opt = (v, def = 0) => (String(v ?? '').trim() === '' ? def : Number(v))
export const sum = (a) => a.reduce((s, x) => s + x, 0)
export const pct = (part, whole) => (whole > 0 ? (part / whole) * 100 : 0)
