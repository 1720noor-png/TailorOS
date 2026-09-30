import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import { money } from '../../components/print.js'
import { num } from '../../utils/calc.js'
import { tip } from '../../utils/shop.js'

export default function TipCalculator() {
  const [bill, setBill] = useState('')
  const [pct, setPct] = useState('15')
  const [people, setPeople] = useState('1')
  const [round, setRound] = useState(false)
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    try { setOut(tip(num(bill), num(pct), num(people), round)); setErr('') } catch (e) { setErr(e.message) }
  }
  const reset = () => { setBill(''); setPct('15'); setPeople('1'); setRound(false); setOut(null); setErr('') }
  const text = out ? `Tip: ${money(out.tip)}\nTotal: ${money(out.total)}${Number(people) > 1 ? `\nEach of ${people} people pays: ${money(out.per)}` : ''}` : ''
  return (
    <div>
      <div className="row">
        <Field label="Bill amount"><input type="number" min="0" step="0.01" value={bill} onChange={(e) => setBill(e.target.value)} /></Field>
        <Field label="Tip (%)"><input type="number" min="0" max="100" step="0.5" value={pct} onChange={(e) => setPct(e.target.value)} /></Field>
        <Field label="Number of people"><input type="number" min="1" max="100" step="1" value={people} onChange={(e) => setPeople(e.target.value)} /></Field>
      </div>
      <div className="actions">
        {[10, 15, 18, 20].map((p) => <button key={p} className="btn ghost" onClick={() => setPct(String(p))}>{p}%</button>)}
      </div>
      <label className="check"><input type="checkbox" checked={round} onChange={(e) => setRound(e.target.checked)} /> Round each person’s share up to a whole number</label>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>Tip: <strong>{money(out.tip)}</strong>{out.rounded && <> ({out.tipPct.toFixed(1)}% after rounding)</>}</p>
        <p>Total: <strong>{money(out.total)}</strong></p>
        {Number(people) > 1 && <p>Each of {people} people pays: <strong>{money(out.per)}</strong></p>}
        <CopyBtn text={text} label="Copy result" />
      </div>}
      <p className="hint">Tip is calculated on the bill amount you enter. Customs differ by country, so pick the percentage that suits you.</p>
    </div>
  )
}
