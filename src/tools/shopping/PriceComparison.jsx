import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import RowsEditor, { newRow } from '../../components/RowsEditor.jsx'
import { money } from '../../components/print.js'
import { opt } from '../../utils/calc.js'
import { comparePrices } from '../../utils/shop.js'

const cols = [
  { k: 'name', label: 'Store / product' },
  { k: 'price', label: 'Price', type: 'number', min: 0, step: '0.01' },
  { k: 'disc', label: 'Discount %', type: 'number', min: 0, step: '0.01' },
  { k: 'ship', label: 'Shipping / delivery', type: 'number', min: 0, step: '0.01' },
]
export default function PriceComparison() {
  const [rows, setRows] = useState(() => [newRow(cols), newRow(cols)])
  const [tax, setTax] = useState('')
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    try { setOut(comparePrices(rows, opt(tax, 0))); setErr('') } catch (e) { setErr(e.message) }
  }
  const reset = () => { setRows([newRow(cols), newRow(cols)]); setTax(''); setOut(null); setErr('') }
  const text = out ? out.map((x, i) => `${i + 1}. ${x.name}: ${money(x.final)}${x.best ? ' – cheapest' : ` (${money(x.more)} more, ${x.morePct.toFixed(1)}%)`}`).join('\n') : ''
  return (
    <div>
      <RowsEditor rows={rows} setRows={setRows} cols={cols} addLabel="Add option" />
      <div className="row"><Field label="Sales tax (%) applied to every option (optional)"><input type="number" min="0" max="100" step="0.01" value={tax} onChange={(e) => setTax(e.target.value)} /></Field></div>
      <div className="actions"><button className="btn" onClick={calc}>Compare prices</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>Cheapest overall: <strong>{out[0].name}</strong> at <strong>{money(out[0].final)}</strong></p>
        <div className="scroll"><table className="tbl">
          <thead><tr><th>Option</th><th className="r">After discount</th><th className="r">Tax</th><th className="r">Shipping</th><th className="r">Final cost</th><th>Compared with cheapest</th></tr></thead>
          <tbody>{out.map((x, i) => (
            <tr key={i} className={x.best ? 'best' : ''}>
              <td>{x.name}</td><td className="r">{money(x.after)}</td><td className="r">{money(x.tax)}</td><td className="r">{money(x.ship)}</td>
              <td className="r"><strong>{money(x.final)}</strong></td><td>{x.best ? 'Cheapest' : `${money(x.more)} more (${x.morePct.toFixed(1)}%)`}</td>
            </tr>))}</tbody>
        </table></div>
        <CopyBtn text={text} label="Copy result" />
      </div>}
      <p className="hint">Final cost = price after discount + tax on the discounted price + shipping. Leave discount, shipping or tax blank if they don’t apply.</p>
    </div>
  )
}
