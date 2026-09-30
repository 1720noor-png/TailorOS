import { useState } from 'react'
import { useStored } from '../../components/hooks.js'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import RowsEditor, { newRow } from '../../components/RowsEditor.jsx'
import { money, printHtml, esc } from '../../components/print.js'
import { num } from '../../utils/calc.js'
import { shopBudget } from '../../utils/shop.js'

const cols = [
  { k: 'name', label: 'Item' },
  { k: 'price', label: 'Price each', type: 'number', min: 0, step: '0.01' },
  { k: 'qty', label: 'Qty', type: 'number', min: 0, step: 'any', def: '1' },
  { k: 'type', label: 'Need or want', options: ['Need', 'Want'] },
]
const blank = () => ({ budget: '', rows: [newRow(cols), newRow(cols)] })
export default function ShoppingBudgetCalculator() {
  const [st, setS] = useStored('toolhub.shop-budget', blank())
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    try { setOut(shopBudget(num(st.budget), st.rows)); setErr('') } catch (e) { setErr(e.message) }
  }
  const reset = () => { setS(blank()); setOut(null); setErr('') }
  const over = out && out.remaining < 0
  const text = out ? [`Budget: ${money(num(st.budget))}`, `Needs: ${money(out.needs)}`, `Wants: ${money(out.wants)}`, `Total planned: ${money(out.total)}`, over ? `Over budget by ${money(-out.remaining)}` : `Left over: ${money(out.remaining)}`].join('\n') : ''
  const print = () => printHtml('Shopping budget', `<h1>Shopping budget</h1><table><tr><th>Item</th><th>Type</th><th class="r">Cost</th></tr>${out.items.map((x) => `<tr><td>${esc(x.name)}</td><td>${esc(x.type)}</td><td class="r">${money(x.cost)}</td></tr>`).join('')}</table><p>${text.split('\n').map(esc).join('<br>')}</p>`)
  return (
    <div>
      <div className="row"><Field label="Total budget"><input type="number" min="0" step="0.01" value={st.budget} onChange={(e) => setS({ ...st, budget: e.target.value })} /></Field></div>
      <RowsEditor rows={st.rows} setRows={(rows) => setS({ ...st, rows })} cols={cols} addLabel="Add item" />
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <div className={'meter' + (over ? ' over' : '')} role="img" aria-label={`${out.used.toFixed(0)}% of budget used`}><span style={{ width: Math.min(100, out.used) + '%' }} /></div>
        <p>Total planned: <strong>{money(out.total)}</strong> ({out.used.toFixed(1)}% of budget)</p>
        <p>Needs: <strong>{money(out.needs)}</strong> · Wants: <strong>{money(out.wants)}</strong></p>
        <p className={over ? 'bad' : 'good'}>{over ? <>Over budget by <strong>{money(-out.remaining)}</strong></> : <>Left over: <strong>{money(out.remaining)}</strong></>}</p>
        {out.room < 0 ? <p className="bad">Your needs alone are {money(-out.room)} over budget.</p>
          : out.wants > 0 && <p>After your needs, {money(out.room)} is available for wants. {out.fits.length ? <>In the order you listed them, these fit: <strong>{out.fits.join(', ')}</strong> ({money(out.fitsCost)}).</> : 'None of your wants fit.'}</p>}
        <div className="actions"><CopyBtn text={text} label="Copy result" /><button className="btn ghost" onClick={print}>Print</button></div>
      </div>}
      <p className="hint">Mark each item as a need or a want to see what fits after essentials. Your entries are saved in this browser only.</p>
    </div>
  )
}
