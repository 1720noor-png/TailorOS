import { useMemo, useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const NAMES_DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function describeField(field, kind) {
  if (field === '*') return kind === 'dow' ? 'every day of the week' : `every ${kind}`
  if (field.startsWith('*/')) return `every ${field.slice(2)} ${kind}(s)`
  if (field.includes(',')) return `at ${kind}s ${field.split(',').join(', ')}`
  if (field.includes('-')) { const [a, b] = field.split('-'); return `every ${kind} from ${a} to ${b}` }
  if (kind === 'dow') return `on ${NAMES_DOW[Number(field)] ?? field}`
  return `at ${kind} ${field}`
}

export default function CronExpressionExplainer() {
  const [expr, setExpr] = useState('*/15 9-17 * * 1-5')
  const parts = expr.trim().split(/\s+/)
  const err = parts.length !== 5 ? 'A cron expression needs exactly 5 fields: minute hour day month weekday.' : ''
  const desc = useMemo(() => {
    if (err) return ''
    const [min, hour, dom, mon, dow] = parts
    const bits = [describeField(min, 'minute'), describeField(hour, 'hour')]
    if (dom !== '*') bits.push(describeField(dom, 'day-of-month'))
    if (mon !== '*') bits.push(describeField(mon, 'month'))
    if (dow !== '*') bits.push(describeField(dow, 'dow'))
    return `Runs ${bits.join(', ')}.`
  }, [expr])
  return (
    <div>
      <Field label="Cron expression"><input value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="minute hour day month weekday" style={{ fontFamily: 'monospace' }} /></Field>
      <Msg>{err}</Msg>
      {desc && <div className="out" role="status"><p>{desc}</p></div>}
      <p className="hint">Standard 5-field cron syntax: minute (0-59) hour (0-23) day-of-month (1-31) month (1-12) day-of-week (0-6, Sunday=0).</p>
    </div>
  )
}
