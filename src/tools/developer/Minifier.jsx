import TextTool from '../../components/TextTool.jsx'
const css = (s) => {
  const o = (s.match(/\{/g) || []).length, c = (s.match(/\}/g) || []).length
  if (o !== c) throw new Error('Unbalanced braces in CSS: cannot minify safely.')
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/:\s+/g, ':').replace(/;}/g, '}').trim()
}
const js = (s) => {
  let out = '', i = 0
  while (i < s.length) {
    const c = s[i], d = s[i + 1]
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1
      while (j < s.length && s[j] !== c) j += s[j] === '\\' ? 2 : 1
      if (j >= s.length) throw new Error('Unterminated string or template literal (regex literals containing quotes are not supported).')
      out += s.slice(i, j + 1); i = j + 1
    } else if (c === '/' && d === '/') { while (i < s.length && s[i] !== '\n') i++ }
    else if (c === '/' && d === '*') { const e = s.indexOf('*/', i + 2); if (e < 0) throw new Error('Unterminated block comment.'); i = e + 2; out += ' ' }
    else if (c === ' ' || c === '\t') { if (out && !/[ \n]$/.test(out)) out += ' '; i++ }
    else { out += c; i++ }
  }
  return out.split('\n').map((l) => l.trim()).filter(Boolean).join('\n')
}
const html = (s) => {
  const keep = []
  s = s.replace(/<(pre|textarea|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (m, tag) => {
    const t = tag.toLowerCase()
    const r = t === 'script' || t === 'style' ? m.replace(/^(<[^>]*>)([\s\S]*)(<\/\w+>)$/, (_, a, b, e) => a + (t === 'style' ? css(b) : js(b)) + e) : m
    keep.push(r); return `\u0000${keep.length - 1}\u0000`
  })
  return s.replace(/<!--(?!\[if)[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim().replace(/\u0000(\d+)\u0000/g, (_, i) => keep[i])
}
export default function Minifier() {
  const fns = { html, css, js }
  return <TextTool select={{ label: 'Language', options: [['html', 'HTML'], ['css', 'CSS'], ['js', 'JavaScript']] }} filename="minified.txt"
    actions={[{ label: 'Minify', run: (t, o) => fns[o](t), stats: true }]}
    note="Safe whitespace and comment removal only. JavaScript keeps line breaks (no variable renaming) to avoid automatic-semicolon bugs. Processed locally." />
}
