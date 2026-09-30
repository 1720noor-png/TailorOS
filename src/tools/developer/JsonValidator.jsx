import TextTool from '../../components/TextTool.jsx'
const run = (t) => {
  try {
    const v = JSON.parse(t)
    const kind = Array.isArray(v) ? `array with ${v.length} item(s)` : v === null ? 'null' : typeof v === 'object' ? `object with ${Object.keys(v).length} key(s)` : typeof v
    return `Valid JSON (${kind}).`
  } catch (e) {
    const m = /position (\d+)/.exec(e.message)
    if (m) { const b = t.slice(0, Number(m[1])).split('\n'); throw new Error(`Invalid JSON: ${e.message} (line ${b.length}, column ${b[b.length - 1].length + 1})`) }
    throw new Error('Invalid JSON: ' + e.message)
  }
}
export default function JsonValidator() {
  return <TextTool actions={[{ label: 'Validate', run, report: true }]} placeholder='{"valid": true}' />
}
