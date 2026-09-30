import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
const n2 = (x) => x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export default function MarketingRoi() {
  const [c, setC] = useState('')
  const [r, setR] = useState('')
  const [x, setX] = useState('')
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    const cost = Number(c), rev = Number(r), ex = x === '' ? 0 : Number(x)
    if (c === '' || r === '') return setErr('Enter both the marketing cost and the revenue.')
    if (!(cost >= 0) || !(rev >= 0) || !(ex >= 0)) return setErr('Amounts must be 0 or more.')
    const total = cost + ex
    if (total <= 0) return setErr('Total cost must be above 0 to calculate ROI.')
    setErr(''); setOut({ total, profit: rev - total, roi: ((rev - total) / total) * 100, roas: cost > 0 ? rev / cost : null })
  }
  const summary = out && `Total cost ${n2(out.total)}, net profit ${n2(out.profit)}, ROI ${out.roi.toFixed(2)}%${out.roas !== null ? `, ROAS ${out.roas.toFixed(2)}x` : ''}`
  return (
    <div>
      <div className="row">
        <Field label="Marketing cost"><input type="number" min="0" step="any" value={c} onChange={(e) => setC(e.target.value)} /></Field>
        <Field label="Revenue from the campaign"><input type="number" min="0" step="any" value={r} onChange={(e) => setR(e.target.value)} /></Field>
        <Field label="Additional expenses (optional)"><input type="number" min="0" step="any" value={x} onChange={(e) => setX(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate ROI</button><button className="btn ghost" onClick={() => { setC(''); setR(''); setX(''); setOut(null); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>ROI: <strong>{out.roi.toFixed(2)}%</strong></p>
        <p>Net profit: <strong>{n2(out.profit)}</strong> · Total cost: {n2(out.total)}</p>
        {out.roas !== null && <p>ROAS (revenue per unit of marketing spend): <strong>{out.roas.toFixed(2)}x</strong></p>}
        <p><small>Formula: ROI = (Revenue − Total cost) ÷ Total cost × 100, where Total cost = Marketing cost + Additional expenses. Break-even revenue is {n2(out.total)}.</small></p>
        <CopyBtn text={summary} label="Copy summary" />
      </div>}
      <p className="hint">Use revenue you can attribute to the campaign. Enter gross profit instead of revenue if you want a margin-adjusted ROI.</p>
    </div>
  )
}
