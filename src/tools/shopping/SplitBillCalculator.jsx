import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import RowsEditor, { newRow } from '../../components/RowsEditor.jsx'
import { money, printHtml, esc } from '../../components/print.js'
import { num, opt } from '../../utils/calc.js'
import { splitEqual, splitItems } from '../../utils/shop.js'

const cols = [{ k: 'name', label: 'Name' }, { k: 'own', label: 'Their own items', type: 'number', min: 0, step: '0.01' }]
export default function SplitBillCalculator() {
  const [mode, setMode] = useState('equal')
  const [total, setTotal] = useState('')
  const [tipPct, setTipPct] = useState('0')
  const [people, setPeople] = useState('2')
  const [rows, setRows] = useState(() => [newRow(cols), newRow(cols)])
  const [shared, setShared] = useState('')
  const [tax, setTax] = useState('')
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    try {
      if (mode === 'equal') setOut({ kind: 'equal', n: num(people), ...splitEqual(num(total), opt(tipPct, 0), num(people)) })
      else setOut({ kind: 'items', ...splitItems(rows, opt(shared, 0), opt(tax, 0), opt(tipPct, 0)) })
      setErr('')
    } catch (e) { setErr(e.message) }
  }
  const reset = () => { setTotal(''); setTipPct('0'); setPeople('2'); setRows([newRow(cols), newRow(cols)]); setShared(''); setTax(''); setOut(null); setErr('') }
  const lines = !out ? [] : out.kind === 'equal'
    ? [`Bill ${money(num(total))} + tip ${money(out.tip)} = ${money(out.grand)}`, `Each of ${out.n} people pays ${money(out.per)}`]
    : [`Subtotal ${money(out.subtotal)} + tax ${money(out.tax)} + tip ${money(out.tip)} = ${money(out.grand)}`, ...out.rows.map((r) => `${r.name}: ${money(r.total)}`)]
  const print = () => printHtml('Split bill', out.kind === 'equal'
    ? `<h1>Split bill</h1><p>${lines.map(esc).join('<br>')}</p>`
    : `<h1>Split bill</h1><table><tr><th>Name</th><th class="r">Own items</th><th class="r">Shared</th><th class="r">Tax</th><th class="r">Tip</th><th class="r">Total</th></tr>${out.rows.map((r) => `<tr><td>${esc(r.name)}</td><td class="r">${money(r.own)}</td><td class="r">${money(r.share)}</td><td class="r">${money(r.tax)}</td><td class="r">${money(r.tip)}</td><td class="r">${money(r.total)}</td></tr>`).join('')}</table><p>${esc(lines[0])}</p>`)
  return (
    <div>
      <Field label="How do you want to split?">
        <select value={mode} onChange={(e) => { setMode(e.target.value); setOut(null); setErr('') }}>
          <option value="equal">Equally between everyone</option>
          <option value="items">By what each person ordered</option>
        </select>
      </Field>
      {mode === 'equal' ? (
        <div className="row">
          <Field label="Bill total"><input type="number" min="0" step="0.01" value={total} onChange={(e) => setTotal(e.target.value)} /></Field>
          <Field label="Tip (%)"><input type="number" min="0" max="100" step="0.5" value={tipPct} onChange={(e) => setTipPct(e.target.value)} /></Field>
          <Field label="Number of people"><input type="number" min="2" max="100" step="1" value={people} onChange={(e) => setPeople(e.target.value)} /></Field>
        </div>
      ) : <>
        <RowsEditor rows={rows} setRows={setRows} cols={cols} addLabel="Add person" min={2} />
        <div className="row">
          <Field label="Shared items (split equally)"><input type="number" min="0" step="0.01" value={shared} onChange={(e) => setShared(e.target.value)} /></Field>
          <Field label="Total tax (shared in proportion)"><input type="number" min="0" step="0.01" value={tax} onChange={(e) => setTax(e.target.value)} /></Field>
          <Field label="Tip (% of the pre-tax subtotal)"><input type="number" min="0" max="100" step="0.5" value={tipPct} onChange={(e) => setTipPct(e.target.value)} /></Field>
        </div>
      </>}
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        {out.kind === 'equal' ? <>
          <p>Tip: <strong>{money(out.tip)}</strong></p>
          <p>Grand total: <strong>{money(out.grand)}</strong></p>
          <p>Each of {out.n} people pays: <strong>{money(out.per)}</strong></p>
        </> : <>
          <div className="scroll"><table className="tbl">
            <thead><tr><th>Name</th><th className="r">Own items</th><th className="r">Shared</th><th className="r">Tax</th><th className="r">Tip</th><th className="r">Total</th></tr></thead>
            <tbody>{out.rows.map((r, i) => <tr key={i}><td>{r.name}</td><td className="r">{money(r.own)}</td><td className="r">{money(r.share)}</td><td className="r">{money(r.tax)}</td><td className="r">{money(r.tip)}</td><td className="r"><strong>{money(r.total)}</strong></td></tr>)}</tbody>
          </table></div>
          <p>Grand total: <strong>{money(out.grand)}</strong> (subtotal {money(out.subtotal)}, tax {money(out.tax)}, tip {money(out.tip)})</p>
        </>}
        <div className="actions"><CopyBtn text={lines.join('\n')} label="Copy result" /><button className="btn ghost" onClick={print}>Print</button></div>
      </div>}
      <p className="hint">Amounts are shown to 2 decimals, so individual shares may differ from the grand total by a cent or two.</p>
    </div>
  )
}
