import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, label: '', needed: '' })

export default function StaffSchedulingCoverageCalculator() {
  const [shifts, setShifts] = useState([{ ...blank(), label: 'Morning', needed: '3' }, { ...blank(), label: 'Afternoon', needed: '4' }, { ...blank(), label: 'Evening', needed: '2' }])
  const [available, setAvailable] = useState('')
  const [hoursPerShift, setHoursPerShift] = useState('8')
  const upd = (id, k, v) => setShifts((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const totalNeeded = shifts.reduce((a, s) => a + (Number(s.needed) || 0), 0)
  const avail = Number(available) || 0
  const gap = totalNeeded - avail
  const totalHours = totalNeeded * (Number(hoursPerShift) || 0)

  return (
    <div>
      {shifts.map((s, i) => (
        <div className="row" key={s.id}>
          <Field label={`Shift ${i + 1}`}><input value={s.label} onChange={(e) => upd(s.id, 'label', e.target.value)} /></Field>
          <Field label="Staff needed"><input type="number" min="0" value={s.needed} onChange={(e) => upd(s.id, 'needed', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setShifts((x) => (x.length > 1 ? x.filter((y) => y.id !== s.id) : x))} aria-label={`Remove ${s.label}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setShifts((s) => [...s, blank()])}>Add shift</button></div>
      <div className="row">
        <Field label="Staff available today"><input type="number" min="0" value={available} onChange={(e) => setAvailable(e.target.value)} /></Field>
        <Field label="Hours per shift"><input type="number" min="0" step="0.5" value={hoursPerShift} onChange={(e) => setHoursPerShift(e.target.value)} /></Field>
      </div>
      <p className="out" role="status">Total staff-shifts needed: <strong>{totalNeeded}</strong> (~{totalHours} labor hours)</p>
      {available !== '' && <Msg kind={gap > 0 ? 'error' : 'status'}>{gap > 0 ? `Short by ${gap} staff-shift${gap === 1 ? '' : 's'}.` : `Fully covered${gap < 0 ? `, with ${-gap} spare` : ''}.`}</Msg>}
    </div>
  )
}
