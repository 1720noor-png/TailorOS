import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function LandlordLateFeeCalculator() {
  const [rent, setRent] = useState('')
  const [feeType, setFeeType] = useState('Flat fee')
  const [flatFee, setFlatFee] = useState('50')
  const [dailyPct, setDailyPct] = useState('5')
  const [daysLate, setDaysLate] = useState('3')
  const [capPct, setCapPct] = useState('10')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const r = Number(rent), d = Number(daysLate)
    if (!(r > 0 && d >= 0)) { setOut(null); return setErr('Enter rent amount greater than 0 and days late of 0 or more.') }
    let fee
    if (feeType === 'Flat fee') fee = Number(flatFee)
    else fee = r * (Number(dailyPct) / 100) * d
    const cap = r * (Number(capPct) / 100)
    const capped = Math.min(fee, cap)
    setErr('')
    setOut({ fee: fee.toFixed(2), capped: capped.toFixed(2), wasCapped: fee > cap })
  }

  return (
    <div>
      <div className="row">
        <Field label="Monthly rent ($)"><input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} /></Field>
        <Field label="Fee type"><select value={feeType} onChange={(e) => setFeeType(e.target.value)}><option>Flat fee</option><option>Daily percentage</option></select></Field>
      </div>
      {feeType === 'Flat fee'
        ? <Field label="Flat late fee ($)"><input type="number" min="0" value={flatFee} onChange={(e) => setFlatFee(e.target.value)} /></Field>
        : <div className="row"><Field label="Fee per day (% of rent)"><input type="number" min="0" step="0.1" value={dailyPct} onChange={(e) => setDailyPct(e.target.value)} /></Field><Field label="Days late"><input type="number" min="0" value={daysLate} onChange={(e) => setDaysLate(e.target.value)} /></Field></div>}
      <Field label="Common state cap (% of rent, optional)"><input type="number" min="0" value={capPct} onChange={(e) => setCapPct(e.target.value)} /></Field>
      <div className="actions"><button className="btn" onClick={calc}>Calculate late fee</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Calculated fee: <strong>${out.fee}</strong>{out.wasCapped && <><br />Capped at ${out.capped} based on the entered cap %</>}</p>}
      <Msg kind="status">Late fee limits vary significantly by state and lease terms — check local law before charging.</Msg>
    </div>
  )
}
