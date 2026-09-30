import { useState } from 'react'
import { Msg, CopyBtn } from '../../components/ui.jsx'
import RowsEditor, { newRow } from '../../components/RowsEditor.jsx'
import { money } from '../../components/print.js'
import { unitPrices, UNIT_NAMES } from '../../utils/shop.js'

const cols = [
  { k: 'name', label: 'Product' },
  { k: 'price', label: 'Price', type: 'number', min: 0, step: '0.01' },
  { k: 'qty', label: 'Size / quantity', type: 'number', min: 0, step: 'any' },
  { k: 'unit', label: 'Unit', options: UNIT_NAMES, def: 'g' },
]
const DIM = { weight: 'By weight', volume: 'By volume', count: 'By count' }
export default function UnitPriceCalculator() {
  const [rows, setRows] = useState(() => [newRow(cols), newRow(cols)])
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    try { setOut(unitPrices(rows)); setErr('') } catch (e) { setErr(e.message) }
  }
  const reset = () => { setRows([newRow(cols), newRow(cols)]); setOut(null); setErr('') }
  const text = out ? out.flatMap((g) => [`${DIM[g.dim]} (${g.label}):`, ...g.items.map((x) => `${x.name}: ${money(x.per)} ${g.label}${x.alt != null ? ` (${money(x.alt)} ${g.altLabel})` : ''}${x.best ? ' – best value' : ''}`)]).join('\n') : ''
  return (
    <div>
      <RowsEditor rows={rows} setRows={setRows} cols={cols} addLabel="Add product" />
      <div className="actions"><button className="btn" onClick={calc}>Compare unit prices</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        {out.map((g) => (
          <div key={g.dim}>
            <h3>{DIM[g.dim]} – price {g.label}</h3>
            <div className="scroll"><table className="tbl">
              <thead><tr><th>Product</th><th className="r">Price {g.label}</th>{g.items[0].alt != null && <th className="r">Price {g.altLabel}</th>}<th>Result</th></tr></thead>
              <tbody>{g.items.map((x, i) => (
                <tr key={i} className={x.best ? 'best' : ''}>
                  <td>{x.name}<br /><small>{x.price.toFixed(2)} for {x.qty} {x.unit}</small></td>
                  <td className="r">{money(x.per)}</td>
                  {g.items[0].alt != null && <td className="r">{money(x.alt)}</td>}
                  <td>{x.best ? 'Best value' : g.compare ? `${x.morePct.toFixed(1)}% more` : '—'}</td>
                </tr>))}</tbody>
            </table></div>
            {!g.compare && <p className="hint">Add another {g.dim === 'count' ? 'counted' : g.dim} product to compare.</p>}
          </div>
        ))}
        {out.length > 1 && <p className="hint">Weight, volume and count products can’t be compared with each other, so they are shown in separate groups.</p>}
        <CopyBtn text={text} label="Copy result" />
      </div>}
      <p className="hint">Ounces and pounds are converted exactly to grams; fluid ounces and gallons are US measures. Unit price is only one part of value: quality and use-by dates matter too.</p>
    </div>
  )
}
