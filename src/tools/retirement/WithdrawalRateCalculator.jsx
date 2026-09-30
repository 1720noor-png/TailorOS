import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function WithdrawalRateCalculator() {
  const [mode, setMode] = useState('From portfolio size')
  const [portfolio, setPortfolio] = useState('')
  const [rate, setRate] = useState('4')
  const [spending, setSpending] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const r = Number(rate)
    if (!(r > 0)) { setOut(null); return setErr('Enter a withdrawal rate greater than 0.') }
    if (mode === 'From portfolio size') {
      const p = Number(portfolio)
      if (!(p > 0)) { setOut(null); return setErr('Enter a portfolio size greater than 0.') }
      setErr(''); setOut({ label: 'annual', val: (p * (r / 100)).toFixed(0) })
    } else {
      const s = Number(spending)
      if (!(s > 0)) { setOut(null); return setErr('Enter your desired annual spending greater than 0.') }
      setErr(''); setOut({ label: 'portfolio', val: (s / (r / 100)).toFixed(0) })
    }
  }

  return (
    <div>
      <Field label="What to calculate"><select value={mode} onChange={(e) => setMode(e.target.value)}><option>From portfolio size</option><option>Portfolio needed for spending</option></select></Field>
      <div className="row">
        {mode === 'From portfolio size'
          ? <Field label="Portfolio size ($)"><input type="number" min="0" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} /></Field>
          : <Field label="Desired annual spending ($)"><input type="number" min="0" value={spending} onChange={(e) => setSpending(e.target.value)} /></Field>}
        <Field label="Withdrawal rate (%)"><input type="number" min="0.1" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button></div>
      <Msg>{err}</Msg>
      {out && out.label === 'annual' && <p className="out" role="status">Sustainable annual withdrawal: <strong>${Number(out.val).toLocaleString()}</strong></p>}
      {out && out.label === 'portfolio' && <p className="out" role="status">Portfolio needed: <strong>${Number(out.val).toLocaleString()}</strong></p>}
      <Msg kind="status">The classic "4% rule" is a rough historical guideline, not a guarantee — actual safe withdrawal rates depend on market conditions and time horizon.</Msg>
    </div>
  )
}
