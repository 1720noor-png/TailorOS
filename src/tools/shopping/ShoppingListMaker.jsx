import { useState } from 'react'
import { useStored, uid } from '../../components/hooks.js'
import { Field, Msg, CopyBtn, download } from '../../components/ui.jsx'
import { money, printHtml, esc } from '../../components/print.js'
import { num } from '../../utils/calc.js'

const CATS = ['Produce', 'Dairy & eggs', 'Meat & fish', 'Bakery', 'Pantry', 'Frozen', 'Drinks', 'Household', 'Personal care', 'Other']
const cost = (i) => (i.price === '' || i.price == null ? 0 : Number(i.price) * Number(i.qty))
export default function ShoppingListMaker() {
  const [items, setItems] = useStored('toolhub.shopping-list', [])
  const [f, setF] = useState({ name: '', qty: '1', cat: CATS[0], price: '' })
  const [err, setErr] = useState('')
  const add = () => {
    const name = f.name.trim(), qty = num(f.qty)
    if (!name) return setErr('Enter an item name.')
    if (!(qty > 0)) return setErr('Quantity must be greater than 0.')
    if (f.price.trim() !== '' && !(Number(f.price) >= 0)) return setErr('Estimated price must be 0 or more.')
    if (items.some((i) => i.name.toLowerCase() === name.toLowerCase() && i.cat === f.cat)) return setErr('That item is already in this category.')
    setItems([...items, { id: uid(), name, qty: String(qty), cat: f.cat, price: f.price.trim(), done: false }])
    setF({ ...f, name: '', qty: '1', price: '' }); setErr('')
  }
  const groups = CATS.map((c) => [c, items.filter((i) => i.cat === c).sort((a, b) => a.name.localeCompare(b.name))]).filter(([, l]) => l.length)
  const est = items.reduce((s, i) => s + cost(i), 0)
  const left = items.filter((i) => !i.done).reduce((s, i) => s + cost(i), 0)
  const done = items.filter((i) => i.done).length
  const text = ['Shopping list', ...groups.flatMap(([c, l]) => ['', c, ...l.map((i) => `[${i.done ? 'x' : ' '}] ${i.name} × ${i.qty}${i.price !== '' ? ` (~${money(cost(i))})` : ''}`)]), ...(est > 0 ? ['', `Estimated total: ${money(est)}`] : [])].join('\n')
  const print = () => printHtml('Shopping list', `<h1>Shopping list</h1>${groups.map(([c, l]) => `<h3>${esc(c)}</h3><table>${l.map((i) => `<tr><td>${i.done ? '☑' : '☐'}</td><td>${esc(i.name)}</td><td>× ${esc(i.qty)}</td><td class="r">${i.price !== '' ? money(cost(i)) : ''}</td></tr>`).join('')}</table>`).join('')}${est > 0 ? `<p><b>Estimated total: ${money(est)}</b></p>` : ''}`)
  return (
    <div>
      <div className="row">
        <Field label="Item"><input value={f.name} maxLength={100} onChange={(e) => setF({ ...f, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && add()} /></Field>
        <Field label="Quantity"><input type="number" min="0" step="any" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} /></Field>
        <Field label="Category"><select value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Estimated price each (optional)"><input type="number" min="0" step="0.01" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></Field>
        <button className="btn" onClick={add}>Add item</button>
      </div>
      <Msg>{err}</Msg>
      {!items.length ? <div className="empty"><p>Your list is empty. Add your first item above.</p></div> : <>
        <p role="status"><strong>{done}</strong> of {items.length} items ticked{est > 0 && <> · Estimated total <strong>{money(est)}</strong> · Still to buy <strong>{money(left)}</strong></>}</p>
        {groups.map(([c, l]) => (
          <div key={c}>
            <h3>{c}</h3>
            <ul className="items">{l.map((i) => (
              <li className="item" key={i.id}>
                <label className="check"><input type="checkbox" checked={i.done} onChange={() => setItems(items.map((x) => (x.id === i.id ? { ...x, done: !x.done } : x)))} />
                  <span style={{ textDecoration: i.done ? 'line-through' : 'none', textTransform: 'none' }}>{i.name} × {i.qty}{i.price !== '' && <> · {money(cost(i))}</>}</span></label>
                <button className="btn ghost" onClick={() => setItems(items.filter((x) => x.id !== i.id))} aria-label={`Remove ${i.name}`}>Remove</button>
              </li>))}</ul>
          </div>
        ))}
        <div className="actions">
          <CopyBtn text={text} label="Copy list" />
          <button className="btn ghost" onClick={() => download('shopping-list.txt', text)}>Download</button>
          <button className="btn ghost" onClick={print}>Print</button>
          <button className="btn ghost" disabled={!done} onClick={() => setItems(items.filter((i) => !i.done))}>Remove ticked items</button>
          <button className="btn ghost" onClick={() => window.confirm('Remove every item?') && setItems([])}>Clear list</button>
        </div>
      </>}
      <p className="hint">Estimated prices are only what you enter. The list is saved in this browser only.</p>
    </div>
  )
}
