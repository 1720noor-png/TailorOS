import TextTool from '../../components/TextTool.jsx'
const fmtCss = (s) => {
  const flat = s.replace(/\s+/g, ' ').replace(/\s*\{\s*/g, ' {\n').replace(/;\s*(?![^(]*\))/g, ';\n').replace(/\s*\}\s*/g, '\n}\n')
  let d = 0
  const out = flat.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    if (l.startsWith('}')) d--
    if (d < 0) throw new Error('Unbalanced braces: there is an extra “}”.')
    const r = '  '.repeat(d) + l
    if (l.endsWith('{')) d++
    return r
  })
  if (d !== 0) throw new Error('Unbalanced braces: a “{” is never closed.')
  return out.join('\n')
}
const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)\b/i
const fmtHtml = (s) => {
  if (/<(pre|textarea|script|style)\b/i.test(s)) throw new Error('HTML containing <pre>, <textarea>, <script> or <style> is not supported (reformatting could change its meaning).')
  let d = 0
  return s.replace(/\s+/g, ' ').split(/(<[^>]+>)/).map((x) => x.trim()).filter(Boolean).map((p) => {
    if (p.startsWith('</')) d = Math.max(0, d - 1)
    const r = '  '.repeat(d) + p
    if (/^<[^!/]/.test(p) && !p.endsWith('/>') && !VOID.test(p.slice(1))) d++
    return r
  }).join('\n')
}
const fmtJson = (t) => { try { return JSON.stringify(JSON.parse(t), null, 2) } catch (e) { throw new Error('Invalid JSON: ' + e.message) } }
export default function CodeFormatter() {
  const fns = { json: fmtJson, css: fmtCss, html: fmtHtml }
  return <TextTool select={{ label: 'Language', options: [['json', 'JSON'], ['css', 'CSS'], ['html', 'HTML']] }} filename="formatted.txt"
    actions={[{ label: 'Format', run: (t, o) => fns[o](t) }]} note="Supports JSON, CSS and HTML. JavaScript formatting needs a full parser and is not included. Processed locally." />
}
