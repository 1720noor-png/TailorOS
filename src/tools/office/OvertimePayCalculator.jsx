import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function OvertimePayCalculator() {
  const [wage, setWage] = useState('25')
  const [regHrs, setRegHrs] = useState('40')
  const [otHrs, setOtHrs] = useState('5')
  const [dtHrs, setDtHrs] = useState('0')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    const w = parseFloat(wage), r = parseFloat(regHrs), o = parseFloat(otHrs), d = parseFloat(dtHrs)
    if (isNaN(w) || isNaN(r) || isNaN(o) || isNaN(d) || w <= 0 || r < 0 || o < 0 || d < 0) {
      return setErr('Enter valid non-negative hours and positive wage.')
    }
    setErr('')
    const regPay = r * w
    const otPay = o * w * 1.5
    const dtPay = d * w * 2.0
    const totalPay = regPay + otPay + dtPay
    const totalHrs = r + o + d
    const effRate = totalHrs > 0 ? totalPay / totalHrs : w
    setRes({ regPay: regPay.toFixed(2), otPay: otPay.toFixed(2), dtPay: dtPay.toFixed(2), totalPay: totalPay.toFixed(2), totalHrs, effRate: effRate.toFixed(2) })
  }

  const reset = () => { setWage('25'); setRegHrs('40'); setOtHrs('5'); setDtHrs('0'); setRes(null); setErr('') }

  return (
    <div>
      <Field label="Base Hourly Wage ($)"><input type="number" step="0.01" value={wage} onChange={(e) => setWage(e.target.value)} /></Field>
      <div className="row" style={{ marginTop: '0.5rem' }}>
        <Field label="Regular Hours (1.0x)"><input type="number" value={regHrs} onChange={(e) => setRegHrs(e.target.value)} /></Field>
        <Field label="Overtime Hours (1.5x)"><input type="number" value={otHrs} onChange={(e) => setOtHrs(e.target.value)} /></Field>
        <Field label="Double Time Hours (2.0x)"><input type="number" value={dtHrs} onChange={(e) => setDtHrs(e.target.value)} /></Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate Wage</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          <p>Total Gross Earnings: <strong>${res.totalPay}</strong> ({res.totalHrs} total hours)</p>
          <p>Regular Pay: ${res.regPay} | OT Pay (1.5x): ${res.otPay} | Double Time (2.0x): ${res.dtPay}</p>
          <p>Effective Average Hourly Rate: <strong>${res.effRate}/hr</strong></p>
          <CopyBtn text={`Total Pay: \$${res.totalPay} (${res.totalHrs} hrs). Reg: \$${res.regPay}, OT: \$${res.otPay}, DT: \$${res.dtPay}`} />
        </div>
      )}
    </div>
  )
}