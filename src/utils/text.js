export const words = (s) => s.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean)
export const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1)
export const tc = (s) => s.split(/\s+/).map(cap).join(' ')
export const tag = (s) => { const w = words(s); return w.length ? '#' + w.map(cap).join('') : '' }
export const list = (s) => s.split(/[,\n]/).map((x) => x.trim()).filter(Boolean)
