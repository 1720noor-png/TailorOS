import { useState } from 'react'
import { Field, Msg, download } from '../../components/ui.jsx'
import RowsEditor, { newRow } from '../../components/RowsEditor.jsx'
import { esc, money, htmlDoc, printHtml } from '../../components/print.js'
const CATS = ['Travel', 'Meals', 'Lodging', 'Transport', 'Supplies', 'Software', 'Other']
const cols = [{ k: 'date', label: 'Date', type: 'date' }, { k: 'cat', label: 'Category', options: CATS }, { k: 'desc', label: 'Description' }, { k: 'amt', label: 'Amount', type: 'number', step: 'any', min: 0 }]
export default function ExpenseReport() {
  const [h, setH] = useState({ title: '', who: '', cur: '$' })
  const [rows, setRows] = useState([newRow(cols)])
  const [rep, setRep] = useState(null)
  const [err, setErr] = useState('')
  const gen = () => {
    setRep(null)
    if (!h.title.trim()) return setErr('Enter a report title.')
    if (!h.who.trim()) return setErr('Enter the employee name.')
    const used = rows.filter((r) => r.date || r.desc.trim() || r.amt !== '')
    if (!used.length) return setErr('Add at least one expense.')
    for (const [i, r] of used.entries()) if (!r.date || !r.desc.trim() || !(Number(r.amt) > 0)) return setErr(`Expense ${i + 1}: date, description and an amount above 0 are required.`)
    const by = {}
    used.forEach((r) => { by[r.cat] = (by[r.cat] || 0) + Number(r.amt) })
    setErr(''); setRep({ used, by, total: used.reduce((a, r) => a + Number(r.amt), 0) })
  }
  const m = (x) => esc(h.cur) + money(x)
  const html = () => `<h1>${esc(h.title)}</h1><p class="muted">Employee: ${esc(h.who)}</p><table><tr><th>Date</th><th>Category</th><th>Description</th><th class="r">Amount</th></tr>${[...rep.used].sort((a, b) => a.date.localeCompare(b.date)).map((r) => `<tr><td>${esc(r.date)}</td><td>${esc(r.cat)}</td><td>${esc(r.desc)}</td><td class="r">${m(r.amt)}</td></tr>`).join('')}<tr><td colspan="3"><strong>Total</strong></td><td class="r"><strong>${m(rep.total)}</strong></td></tr></table><h3>By category</h3><table>${Object.entries(rep.by).map(([k, v]) => `<tr><td>${esc(k)}</td><td class="r">${m(v)}</td></tr>`).join('')}</table>`
  const csv = () => download('expense-report.csv', ['Date,Category,Description,Amount', ...rep.used.map((r) => `${r.date},${r.cat},"${r.desc.replace(/"/g, '""')}",${Number(r.amt).toFixed(2)}`), `,,Total,${rep.total.toFixed(2)}`].join('\n'), 'text/csv')
  return (
    <div>
      <div className="row"><Field label="Report title *"><input value={h.title} onChange={(e) => setH({ ...h, title: e.target.value })} placeholder="March business trip" /></Field><Field label="Employee name *"><input value={h.who} onChange={(e) => setH({ ...h, who: e.target.value })} /></Field><Field label="Currency symbol"><input value={h.cur} maxLength={4} onChange={(e) => setH({ ...h, cur: e.target.value })} /></Field></div>
      <RowsEditor rows={rows} setRows={setRows} cols={cols} addLabel="Add expense" />
      <div className="actions"><button className="btn" onClick={gen}>Generate report</button><button className="btn ghost" onClick={() => { setH({ title: '', who: '', cur: '$' }); setRows([newRow(cols)]); setRep(null); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {rep && <><div className="paper" dangerouslySetInnerHTML={{ __html: html() }} />
        <div className="actions"><button className="btn ghost" onClick={() => printHtml(h.title, html())}>Print / save as PDF</button><button className="btn ghost" onClick={csv}>Download CSV</button>
          <button className="btn ghost" onClick={() => download('expense-report.html', htmlDoc(h.title, html()), 'text/html')}>Download HTML</button></div></>}
    </div>
  )
}
