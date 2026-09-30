import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
const WE = { 'sat-sun': [0, 6], 'fri-sat': [5, 6], none: [] }
export default function LeaveCalculator() {
  const [s, setS] = useState('')
  const [e, setE] = useState('')
  const [we, setWe] = useState('sat-sun')
  const [hol, setHol] = useState('')
  const [bal, setBal] = useState('')
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    if (!s || !e) return setErr('Choose both a start and an end date.')
    const a = new Date(s + 'T00:00:00'), b = new Date(e + 'T00:00:00')
    if (b < a) return setErr('The end date must be on or after the start date.')
    if (bal !== '' && Number(bal) < 0) return setErr('Leave balance cannot be negative.')
    const hs = hol.split(/[\s,;]+/).filter(Boolean)
    const bad = hs.find((h) => !/^\d{4}-\d{2}-\d{2}$/.test(h) || Number.isNaN(new Date(h + 'T00:00:00').getTime()))
    if (bad) return setErr(`“${bad}” is not a valid holiday date. Use YYYY-MM-DD, separated by commas or new lines.`)
    const hset = new Set(hs)
    let total = 0, wk = 0, hd = 0
    for (const x = new Date(a); x <= b; x.setDate(x.getDate() + 1)) {
      total++
      const key = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
      if (WE[we].includes(x.getDay())) wk++
      else if (hset.has(key)) hd++
    }
    const days = total - wk - hd
    setErr(''); setOut({ total, wk, hd, days, left: bal === '' ? null : Number(bal) - days })
  }
  const reset = () => { setS(''); setE(''); setHol(''); setBal(''); setWe('sat-sun'); setOut(null); setErr('') }
  return (
    <div>
      <div className="row">
        <Field label="First day of leave"><input type="date" value={s} onChange={(x) => setS(x.target.value)} /></Field>
        <Field label="Last day of leave"><input type="date" value={e} onChange={(x) => setE(x.target.value)} /></Field>
        <Field label="Weekend days"><select value={we} onChange={(x) => setWe(x.target.value)}><option value="sat-sun">Saturday and Sunday</option><option value="fri-sat">Friday and Saturday</option><option value="none">None (count every day)</option></select></Field>
        <Field label="Leave balance (days, optional)"><input type="number" min="0" step="0.5" value={bal} onChange={(x) => setBal(x.target.value)} /></Field>
      </div>
      <Field label="Public holidays in this period (optional, YYYY-MM-DD, one per line)"><textarea rows="3" value={hol} onChange={(x) => setHol(x.target.value)} placeholder={'2026-12-25'} /></Field>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>Leave days used: <strong>{out.days}</strong></p>
        <p><small>How it was calculated: {out.total} calendar day(s) (both dates included) − {out.wk} weekend day(s) − {out.hd} holiday(s) that fall on working days = {out.days}. Holidays outside the range or on weekends are not counted twice.</small></p>
        {out.left !== null && <p>Remaining balance: <strong>{out.left}</strong>{out.left < 0 && ' (over your balance)'}</p>}
      </div>}
      <p className="hint">Half days and company-specific rules are not handled. Holidays are entered by you; no holiday calendar is fetched.</p>
    </div>
  )
}
