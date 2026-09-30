import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
const SETS = { lower: 'abcdefghijklmnopqrstuvwxyz', upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', digits: '0123456789', symbols: '!@#$%^&*()-_=+[]{};:,.?' }
const rnd = (n) => {
  const lim = Math.floor(2 ** 32 / n) * n
  const a = new Uint32Array(1)
  do crypto.getRandomValues(a); while (a[0] >= lim)
  return a[0] % n
}
export default function PasswordGenerator() {
  const [len, setLen] = useState(16)
  const [on, setOn] = useState({ lower: true, upper: true, digits: true, symbols: true })
  const [pw, setPw] = useState('')
  const [bits, setBits] = useState(0)
  const [err, setErr] = useState('')
  const gen = () => {
    const keys = Object.keys(on).filter((k) => on[k])
    const L = Number(len)
    if (!keys.length) return setErr('Select at least one character type.')
    if (!Number.isInteger(L) || L < 8 || L > 128) return setErr('Length must be a whole number from 8 to 128.')
    if (!window.crypto?.getRandomValues) return setErr('Secure random numbers are not available in this browser.')
    const pool = keys.map((k) => SETS[k]).join('')
    let s
    do s = Array.from({ length: L }, () => pool[rnd(pool.length)]).join('')
    while (!keys.every((k) => [...s].some((c) => SETS[k].includes(c))))
    setErr(''); setPw(s); setBits(Math.round(L * Math.log2(pool.length)))
  }
  const reset = () => { setLen(16); setOn({ lower: true, upper: true, digits: true, symbols: true }); setPw(''); setErr('') }
  const label = bits < 60 ? 'Fair' : bits < 100 ? 'Strong' : 'Very strong'
  return (
    <div>
      <Field label={`Length: ${len}`}><input type="range" min="8" max="128" value={len} onChange={(e) => setLen(e.target.value)} /></Field>
      <div className="checks">{Object.keys(SETS).map((k) => <label className="check" key={k}><input type="checkbox" checked={on[k]} onChange={(e) => setOn({ ...on, [k]: e.target.checked })} /> {k}</label>)}</div>
      <div className="actions"><button className="btn" onClick={gen}>Generate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {pw && <div className="out" role="status"><code>{pw}</code><CopyBtn text={pw} /><p><small>{bits} bits of entropy · {label}</small></p></div>}
      <p className="hint">Generated locally with your browser’s secure random generator. Nothing is sent or stored.</p>
    </div>
  )
}
