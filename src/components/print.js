export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export const money = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const STYLE = 'body{font:14px/1.5 Arial,sans-serif;margin:24px;color:#111}table{border-collapse:collapse;width:100%;margin:12px 0}td,th{border:1px solid #999;padding:6px;text-align:left;vertical-align:top}.r{text-align:right}h1{margin:0 0 8px}.muted{color:#555}pre{white-space:pre-wrap;font:inherit}'
export const htmlDoc = (title, body) => `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${STYLE}</style></head><body>${body}</body></html>`
export function printHtml(title, body) {
  const f = document.createElement('iframe')
  f.style.cssText = 'position:fixed;width:0;height:0;border:0'
  f.srcdoc = htmlDoc(title, body)
  f.onload = () => { f.contentWindow.focus(); f.contentWindow.print(); setTimeout(() => f.remove(), 2000) }
  document.body.appendChild(f)
}
