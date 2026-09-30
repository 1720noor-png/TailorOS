import { useState } from 'react'
import { Field, Msg, download } from '../../components/ui.jsx'
import RowsEditor, { newRow } from '../../components/RowsEditor.jsx'
import { today } from '../../components/hooks.js'
import { esc, money, htmlDoc, printHtml } from '../../components/print.js'
const cols = [{ k: 'desc', label: 'Description' }, { k: 'qty', label: 'Qty', type: 'number', def: '1', step: 'any', min: 0 }, { k: 'price', label: 'Unit price', type: 'number', step: 'any', min: 0 }]
const init = () => ({ bizName: '', bizAddr: '', bizEmail: '', custName: '', custAddr: '', num: 'INV-001', date: today(), due: '', cur: '$', tax: '', disc: '', notes: '' })
const br = (s) => esc(s).replace(/\n/g, '<br>')
function html(f, v) {
  const m = (x) => esc(f.cur) + money(x)
  return `<h1>Invoice ${esc(f.num)}</h1><p class="muted">Date: ${esc(f.date)}${f.due ? ` · Due: ${esc(f.due)}` : ''}</p>
<table><tr><td><strong>From</strong><br>${esc(f.bizName)}<br>${br(f.bizAddr)}${f.bizEmail ? '<br>' + esc(f.bizEmail) : ''}</td><td><strong>Bill to</strong><br>${esc(f.custName)}<br>${br(f.custAddr)}</td></tr></table>
<table><tr><th>Description</th><th class="r">Qty</th><th class="r">Unit price</th><th class="r">Amount</th></tr>${v.lines.map((l) => `<tr><td>${esc(l.desc)}</td><td class="r">${esc(l.qty)}</td><td class="r">${m(l.price)}</td><td class="r">${m(l.amt)}</td></tr>`).join('')}</table>
<table><tr><td>Subtotal</td><td class="r">${m(v.sub)}</td></tr>${v.disc ? `<tr><td>Discount (${v.disc}%)</td><td class="r">−${m(v.dAmt)}</td></tr>` : ''}${v.tax ? `<tr><td>Tax (${v.tax}%)</td><td class="r">${m(v.tAmt)}</td></tr>` : ''}<tr><td><strong>Total</strong></td><td class="r"><strong>${m(v.total)}</strong></td></tr></table>${f.notes ? `<p><strong>Notes</strong><br>${br(f.notes)}</p>` : ''}`
}
export default function InvoiceGenerator() {
  const [f, setF] = useState(init)
  const [rows, setRows] = useState([newRow(cols)])
  const [inv, setInv] = useState(null)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const build = () => {
    setInv(null)
    if (!f.bizName.trim()) return setErr('Enter your business name.')
    if (!f.custName.trim()) return setErr('Enter the customer name.')
    if (!f.num.trim()) return setErr('Enter an invoice number.')
    if (!f.date) return setErr('Choose the invoice date.')
    if (f.bizEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.bizEmail)) return setErr('Enter a valid business email or leave it empty.')
    const used = rows.filter((r) => r.desc.trim() || r.price !== '')
    if (!used.length) return setErr('Add at least one item with a description and price.')
    if (used.some((r) => !r.desc.trim() || !(Number(r.qty) > 0) || r.price === '' || !(Number(r.price) >= 0))) return setErr('Each item needs a description, a quantity above 0 and a price of 0 or more.')
    const tax = f.tax === '' ? 0 : Number(f.tax), disc = f.disc === '' ? 0 : Number(f.disc)
    if (!(tax >= 0 && tax <= 100)) return setErr('Tax must be between 0 and 100%.')
    if (!(disc >= 0 && disc <= 100)) return setErr('Discount must be between 0 and 100%.')
    const lines = used.map((r) => ({ ...r, amt: Number(r.qty) * Number(r.price) }))
    const sub = lines.reduce((a, l) => a + l.amt, 0), dAmt = (sub * disc) / 100, tAmt = ((sub - dAmt) * tax) / 100
    setErr(''); setInv({ lines, sub, disc, dAmt, tax, tAmt, total: sub - dAmt + tAmt })
  }
  const reset = () => { setF(init()); setRows([newRow(cols)]); setInv(null); setErr('') }
  return (
    <div>
      <div className="row">
        <Field label="Your business name *"><input value={f.bizName} onChange={set('bizName')} /></Field>
        <Field label="Business email"><input type="email" value={f.bizEmail} onChange={set('bizEmail')} /></Field>
        <Field label="Customer name *"><input value={f.custName} onChange={set('custName')} /></Field>
      </div>
      <div className="row">
        <Field label="Business address"><textarea rows="2" value={f.bizAddr} onChange={set('bizAddr')} /></Field>
        <Field label="Customer address"><textarea rows="2" value={f.custAddr} onChange={set('custAddr')} /></Field>
      </div>
      <div className="row">
        <Field label="Invoice number *"><input value={f.num} onChange={set('num')} /></Field>
        <Field label="Invoice date *"><input type="date" value={f.date} onChange={set('date')} /></Field>
        <Field label="Due date"><input type="date" value={f.due} onChange={set('due')} /></Field>
        <Field label="Currency symbol"><input value={f.cur} onChange={set('cur')} maxLength={4} /></Field>
      </div>
      <h3>Items</h3>
      <RowsEditor rows={rows} setRows={setRows} cols={cols} addLabel="Add item" />
      <div className="row">
        <Field label="Discount % (optional)"><input type="number" min="0" max="100" step="any" value={f.disc} onChange={set('disc')} /></Field>
        <Field label="Tax % (optional)"><input type="number" min="0" max="100" step="any" value={f.tax} onChange={set('tax')} /></Field>
      </div>
      <Field label="Notes / payment details"><textarea rows="2" value={f.notes} onChange={set('notes')} /></Field>
      <div className="actions"><button className="btn" onClick={build}>Generate invoice</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {inv && <><div className="paper" dangerouslySetInnerHTML={{ __html: html(f, inv) }} />
        <div className="actions"><button className="btn ghost" onClick={() => printHtml('Invoice ' + f.num, html(f, inv))}>Print / save as PDF</button>
          <button className="btn ghost" onClick={() => download(`invoice-${f.num.replace(/[^\w-]+/g, '_')}.html`, htmlDoc('Invoice ' + f.num, html(f, inv)), 'text/html')}>Download HTML</button></div></>}
      <p className="hint">Totals: discount is applied before tax. Everything stays in your browser.</p>
    </div>
  )
}
