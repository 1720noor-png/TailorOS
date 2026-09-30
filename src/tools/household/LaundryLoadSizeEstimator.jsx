import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const CAPACITY_LB = { 'Compact (1.6-2.5 cu ft)': 8, 'Standard (3.5-4.5 cu ft)': 15, 'Large (4.5-5.5 cu ft)': 20, 'Extra-large (5.5+ cu ft)': 26 }
const ITEM_LB = { Shirt: 0.5, Pants: 0.75, Towel: 0.9, Sheet: 1.2, 'Bath robe': 1.4, Sweater: 0.7 }

export default function LaundryLoadSizeEstimator() {
  const [machine, setMachine] = useState('Standard (3.5-4.5 cu ft)')
  const [items, setItems] = useState({ Shirt: '', Pants: '', Towel: '', Sheet: '', 'Bath robe': '', Sweater: '' })
  const upd = (k, v) => setItems((i) => ({ ...i, [k]: v }))

  const totalLb = Object.entries(items).reduce((a, [k, v]) => a + (Number(v) || 0) * ITEM_LB[k], 0)
  const cap = CAPACITY_LB[machine]
  const pctFull = (totalLb / cap) * 100

  return (
    <div>
      <Field label="Machine size"><select value={machine} onChange={(e) => setMachine(e.target.value)}>{Object.keys(CAPACITY_LB).map((m) => <option key={m}>{m}</option>)}</select></Field>
      {Object.keys(items).map((k) => (
        <div className="row" key={k}>
          <Field label={k}><input type="number" min="0" value={items[k]} onChange={(e) => upd(k, e.target.value)} /></Field>
        </div>
      ))}
      <p className="out" role="status">Estimated load weight: <strong>{totalLb.toFixed(1)} lb</strong> ({pctFull.toFixed(0)}% of a {machine.split(' (')[0].toLowerCase()} machine)</p>
      {pctFull > 100 && <Msg>Over capacity — split into two loads for better cleaning.</Msg>}
      {pctFull > 0 && pctFull < 50 && <Msg kind="status">Under half full — you could combine with another load to save water and energy.</Msg>}
    </div>
  )
}
