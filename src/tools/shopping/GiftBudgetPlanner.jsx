import { useState } from 'react'
import { useStored } from '../../components/hooks.js'
import { Field, Msg, CopyBtn, download } from '../../components/ui.jsx'
import RowsEditor, { newRow } from '../../components/RowsEditor.jsx'
import { money, printHtml, esc } from '../../components/print.js'
import { num } from '../../utils/calc.js'
import { giftPlan } from '../../utils/shop.js'

const cols = [
  { k: 'who', label: 'Recipient' }, { k: 'occasion', label: 'Occasion' }, { k: 'idea', label: 'Gift idea' },
  { k: 'planned', label: 'Planned budget', type: 'number', min: 0, step: '0.01' },
  { k: 'spent', label: 'Spent so far', type: 'number', min: 0, step: '0.01' },
]
const blank = () => ({ budget: '', rows: [newRow(cols), newRow(cols), newRow(cols)] })
export default function GiftBudgetPlanner() {
  const [st, setS] = useStored('toolhub.gift-budget', blank())
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    try { setOut(giftPlan(num(st.budget), st.rows)); setErr('') } catch (e) { setErr(e.message) }
  }
  const reset = () => { setS(blank()); setOut(null); setErr('') }
  const csv = () => out ? ['Recipient,Occasion,Gift idea,Planned,Spent,Left', ...out.items.map((x) => [x.label, x.occasion, x.idea, x.planned.toFixed(2), x.spent.toFixed(2), x.left.toFixed(2)].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))].join('\n') : ''
  const text = out ? [`Gift budget: ${money(num(st.budget))}`, ...out.items.map((x) => `${x.label}${x.occasion ? ` (${x.occasion})` : ''}: planned ${money(x.planned)}, spent ${money(x.spent)}${x.over ? ` – over by ${money(-x.left)}` : ''}`), `Planned in total: ${money(out.planned)} · Spent: ${money(out.spent)} · Left of overall budget: ${money(out.remaining)}`].join('\n') : ''
  const print = () => printHtml('Gift budget', `<h1>Gift budget</h1><table><tr><th>Recipient</th><th>Occasion</th><th>Idea</th><th class="r">Planned</th><th class="r">Spent</th><th class="r">Left</th></tr>${out.items.map((x) => `<tr><td>${esc(x.label)}</td><td>${esc(x.occasion)}</td><td>${esc(x.idea)}</td><td class="r">${money(x.planned)}</td><td class="r">${money(x.spent)}</td><td class="r">${money(x.left)}</td></tr>`).join('')}</table><p>Overall budget ${money(num(st.budget))} · Planned ${money(out.planned)} · Spent ${money(out.spent)} · Remaining ${money(out.remaining)}</p>`)
  return (
    <div>
      <div className="row"><Field label="Total gift budget"><input type="number" min="0" step="0.01" value={st.budget} onChange={(e) => setS({ ...st, budget: e.target.value })} /></Field></div>
      <RowsEditor rows={st.rows} setRows={(rows) => setS({ ...st, rows })} cols={cols} addLabel="Add recipient" />
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <div className={'meter' + (out.remaining < 0 ? ' over' : '')} role="img" aria-label={`${out.usedPct.toFixed(0)}% of budget spent`}><span style={{ width: Math.min(100, out.usedPct) + '%' }} /></div>
        <p>Planned: <strong>{money(out.planned)}</strong> · Spent: <strong>{money(out.spent)}</strong> ({out.usedPct.toFixed(1)}% of budget)</p>
        <p className={out.remaining < 0 ? 'bad' : 'good'}>{out.remaining < 0 ? <>Over budget by <strong>{money(-out.remaining)}</strong></> : <>Remaining overall: <strong>{money(out.remaining)}</strong></>}</p>
        {out.unallocated < 0 ? <p className="bad">You have planned {money(-out.unallocated)} more than your total budget.</p> : <p>Not yet allocated to anyone: <strong>{money(out.unallocated)}</strong></p>}
        <div className="scroll"><table className="tbl">
          <thead><tr><th>Recipient</th><th>Occasion</th><th className="r">Planned</th><th className="r">Spent</th><th className="r">Left</th></tr></thead>
          <tbody>{out.items.map((x, i) => <tr key={i}><td>{x.label}{x.idea && <><br /><small>{x.idea}</small></>}</td><td>{x.occasion}</td><td className="r">{money(x.planned)}</td><td className="r">{money(x.spent)}</td><td className={'r ' + (x.over ? 'bad' : '')}>{x.over ? '−' + money(-x.left) : money(x.left)}</td></tr>)}</tbody>
        </table></div>
        <div className="actions"><CopyBtn text={text} label="Copy result" /><button className="btn ghost" onClick={() => download('gift-budget.csv', csv(), 'text/csv')}>Download CSV</button><button className="btn ghost" onClick={print}>Print</button></div>
      </div>}
      <p className="hint">Fill in planned amounts first, then update “spent” as you buy. Your entries are saved in this browser only.</p>
    </div>
  )
}
