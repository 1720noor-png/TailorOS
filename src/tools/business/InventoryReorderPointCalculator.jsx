import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function InventoryReorderPointCalculator() {
  const [avgDaily, setAvgDaily] = useState('')
  const [leadTime, setLeadTime] = useState('')
  const [safety, setSafety] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const d = Number(avgDaily), l = Number(leadTime), s = Number(safety) || 0
    if (!(d >= 0 && l >= 0 && s >= 0)) { setOut(null); return setErr('Enter average daily usage, lead time and safety stock as 0 or more.') }
    const rop = d * l + s
    setErr('')
    setOut(Math.ceil(rop))
  }

  return (
    <div>
      <div className="row">
        <Field label="Average daily usage (units)"><input type="number" min="0" step="0.1" value={avgDaily} onChange={(e) => setAvgDaily(e.target.value)} /></Field>
        <Field label="Supplier lead time (days)"><input type="number" min="0" step="0.1" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} /></Field>
        <Field label="Safety stock (units)"><input type="number" min="0" value={safety} onChange={(e) => setSafety(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate reorder point</button></div>
      <Msg>{err}</Msg>
      {out !== null && <p className="out" role="status">Reorder when stock falls to: <strong>{out} units</strong></p>}
      <Msg kind="status">Reorder point = (average daily usage × lead time) + safety stock.</Msg>
    </div>
  )
}
