import { useState } from 'react'
import { useStored, uid } from '../../components/hooks.js'
import { Field, Msg, CopyBtn, download } from '../../components/ui.jsx'
import RowsEditor from '../../components/RowsEditor.jsx'
import { money, printHtml, esc } from '../../components/print.js'
import { num } from '../../utils/calc.js'
import { groceryPlan } from '../../utils/shop.js'

const cols = [
  { k: 'cat', label: 'Category' },
  { k: 'planned', label: 'Planned', type: 'number', min: 0, step: '0.01' },
  { k: 'spent', label: 'Spent so far', type: 'number', min: 0, step: '0.01' },
]
const CATS = ['Fruit & vegetables', 'Meat, fish & eggs', 'Dairy', 'Bread & grains', 'Pantry & tins', 'Drinks', 'Snacks', 'Household']
const blank = () => ({ period: 'Weekly', budget: '', rows: CATS.map((cat) => ({ id: uid(), cat, planned: '', spent: '' })) })
const PERIOD_UNIT = { Weekly: 'week', Fortnightly: 'fortnight', Monthly: 'month' }
export default function GroceryBudgetPlanner() {
  const [st, setS] = useStored('toolhub.grocery-budget', blank())
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    try { setOut(groceryPlan(num(st.budget), st.rows)); setErr('') } catch (e) { setErr(e.message) }
  }
  const reset = () => { setS(blank()); setOut(null); setErr('') }
  const unit = PERIOD_UNIT[st.period]
  const csv = () => out ? ['Category,Planned,Spent,Left', ...out.items.map((x) => `"${x.label.replace(/"/g, '""')}",${x.planned.toFixed(2)},${x.spent.toFixed(2)},${x.left.toFixed(2)}`)].join('\n') : ''
  const text = out ? [`${st.period} grocery budget: ${money(num(st.budget))}`, ...out.items.map((x) => `${x.label}: planned ${money(x.planned)}, spent ${money(x.spent)}${x.over ? ` – over by ${money(-x.left)}` : ''}`), `Planned: ${money(out.planned)} · Spent: ${money(out.spent)} · Left this ${unit}: ${money(out.remaining)}`].join('\n') : ''
  const print = () => printHtml('Grocery budget', `<h1>${esc(st.period)} grocery budget</h1><table><tr><th>Category</th><th class="r">Planned</th><th class="r">Spent</th><th class="r">Left</th></tr>${out.items.map((x) => `<tr><td>${esc(x.label)}</td><td class="r">${money(x.planned)}</td><td class="r">${money(x.spent)}</td><td class="r">${money(x.left)}</td></tr>`).join('')}</table><p>Budget ${money(num(st.budget))} · Planned ${money(out.planned)} · Spent ${money(out.spent)} · Remaining ${money(out.remaining)}</p>`)
  return (
    <div>
      <div className="row">
        <Field label="Budget period"><select value={st.period} onChange={(e) => setS({ ...st, period: e.target.value })}>{Object.keys(PERIOD_UNIT).map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label={`${st.period} grocery budget`}><input type="number" min="0" step="0.01" value={st.budget} onChange={(e) => setS({ ...st, budget: e.target.value })} /></Field>
      </div>
      <RowsEditor rows={st.rows} setRows={(rows) => setS({ ...st, rows })} cols={cols} addLabel="Add category" />
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <div className={'meter' + (out.remaining < 0 ? ' over' : '')} role="img" aria-label={`${out.usedPct.toFixed(0)}% of budget spent`}><span style={{ width: Math.min(100, out.usedPct) + '%' }} /></div>
        <p>Planned: <strong>{money(out.planned)}</strong> · Spent: <strong>{money(out.spent)}</strong> ({out.usedPct.toFixed(1)}% of budget)</p>
        <p className={out.remaining < 0 ? 'bad' : 'good'}>{out.remaining < 0 ? <>Over budget by <strong>{money(-out.remaining)}</strong></> : <>Left this {unit}: <strong>{money(out.remaining)}</strong></>}</p>
        {out.unallocated < 0 ? <p className="bad">Your planned amounts add up to {money(-out.unallocated)} more than your budget.</p> : <p>Not yet planned: <strong>{money(out.unallocated)}</strong></p>}
        <div className="scroll"><table className="tbl">
          <thead><tr><th>Category</th><th className="r">Planned</th><th className="r">Spent</th><th className="r">Left</th></tr></thead>
          <tbody>{out.items.map((x, i) => <tr key={i}><td>{x.label}</td><td className="r">{money(x.planned)}</td><td className="r">{money(x.spent)}</td><td className={'r ' + (x.over ? 'bad' : '')}>{x.over ? '−' + money(-x.left) : money(x.left)}</td></tr>)}</tbody>
        </table></div>
        <div className="actions"><CopyBtn text={text} label="Copy result" /><button className="btn ghost" onClick={() => download('grocery-budget.csv', csv(), 'text/csv')}>Download CSV</button><button className="btn ghost" onClick={print}>Print</button></div>
      </div>}
      <p className="hint">Set planned amounts before you shop, then update “spent” as you go. Your entries are saved in this browser only.</p>
    </div>
  )
}
