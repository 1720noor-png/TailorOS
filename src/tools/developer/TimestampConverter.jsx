import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
export default function TimestampConverter() {
  const [ts, setTs] = useState('')
  const [a, setA] = useState(null)
  const [dt, setDt] = useState('')
  const [zone, setZone] = useState('local')
  const [b, setB] = useState(null)
  const [err, setErr] = useState('')
  const toDate = () => {
    setA(null)
    if (!/^-?\d+$/.test(ts.trim())) return setErr('Enter a whole-number Unix timestamp (seconds or milliseconds).')
    const n = Number(ts.trim()), ms = Math.abs(n) >= 1e11 ? n : n * 1000, d = new Date(ms)
    if (Number.isNaN(d.getTime())) return setErr('That timestamp is outside the supported date range.')
    setErr(''); setA({ unit: Math.abs(n) >= 1e11 ? 'milliseconds' : 'seconds', iso: d.toISOString(), local: d.toString() })
  }
  const toStamp = () => {
    setB(null)
    if (!dt) return setErr('Choose a date and time.')
    const d = new Date(zone === 'utc' ? dt + 'Z' : dt)
    if (Number.isNaN(d.getTime())) return setErr('That date is not valid.')
    setErr(''); setB({ s: String(Math.floor(d.getTime() / 1000)), ms: String(d.getTime()) })
  }
  const now = () => { const n = Date.now(); setTs(String(Math.floor(n / 1000))); setErr('') }
  const row = (k, x) => <p key={k}>{k}: <code style={{ display: 'inline' }}>{x}</code> <CopyBtn text={x} /></p>
  return (
    <div>
      <h3>Unix timestamp to date</h3>
      <div className="row"><Field label="Unix timestamp"><input value={ts} onChange={(e) => setTs(e.target.value)} placeholder="1700000000" inputMode="numeric" /></Field>
        <div className="actions"><button className="btn" onClick={toDate}>Convert to date</button><button className="btn ghost" onClick={now}>Use current time</button></div></div>
      {a && <div className="out" role="status"><p><small>Read as {a.unit}</small></p>{row('UTC (ISO 8601)', a.iso)}{row('Local time', a.local)}</div>}
      <h3>Date to Unix timestamp</h3>
      <div className="row"><Field label="Date and time"><input type="datetime-local" step="1" value={dt} onChange={(e) => setDt(e.target.value)} /></Field>
        <Field label="Interpret as"><select value={zone} onChange={(e) => setZone(e.target.value)}><option value="local">My local time zone</option><option value="utc">UTC</option></select></Field></div>
      <div className="actions"><button className="btn" onClick={toStamp}>Convert to timestamp</button><button className="btn ghost" onClick={() => { setTs(''); setDt(''); setA(null); setB(null); setErr('') }}>Reset</button></div>
      {b && <div className="out" role="status">{row('Seconds', b.s)}{row('Milliseconds', b.ms)}</div>}
      <Msg>{err}</Msg>
    </div>
  )
}
