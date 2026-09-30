import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// simplified IRS Uniform Lifetime Table (select ages)
const LIFE_EXPECTANCY = { 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2 }

export default function RmdCalculator() {
  const [balance, setBalance] = useState('')
  const [age, setAge] = useState('75')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const b = Number(balance), a = Number(age)
    if (!(b > 0)) { setOut(null); return setErr('Enter your account balance as of Dec 31 last year, greater than 0.') }
    const factor = LIFE_EXPECTANCY[a] || (a < 73 ? null : 11.5)
    if (!factor) { setOut(null); return setErr('RMDs generally start at age 73 — enter an age of 73 or older.') }
    setErr('')
    setOut({ rmd: (b / factor).toFixed(0), factor })
  }

  return (
    <div>
      <div className="row">
        <Field label="Account balance, prior Dec 31 ($)"><input type="number" min="0" value={balance} onChange={(e) => setBalance(e.target.value)} /></Field>
        <Field label="Your age this year"><input type="number" min="73" max="100" value={age} onChange={(e) => setAge(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate RMD</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Required minimum distribution this year: <strong>${Number(out.rmd).toLocaleString()}</strong> (life expectancy factor: {out.factor})</p>}
      <Msg kind="status">Based on the IRS Uniform Lifetime Table — use the Joint Life table instead if your spouse is the sole beneficiary and more than 10 years younger.</Msg>
    </div>
  )
}
