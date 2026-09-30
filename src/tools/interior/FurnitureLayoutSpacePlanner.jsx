import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, name: '', w: '', d: '' })

export default function FurnitureLayoutSpacePlanner() {
  const [roomW, setRoomW] = useState('12')
  const [roomL, setRoomL] = useState('14')
  const [items, setItems] = useState([{ ...blank(), name: 'Sofa', w: '7', d: '3' }])
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)
  const upd = (id, k, v) => setItems((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const calc = () => {
    const rw = Number(roomW), rl = Number(roomL)
    if (!(rw > 0 && rl > 0)) { setOut(null); return setErr('Enter room width and length greater than 0.') }
    const used = items.filter((i) => Number(i.w) > 0 && Number(i.d) > 0)
    const roomArea = rw * rl
    const furnitureArea = used.reduce((a, i) => a + Number(i.w) * Number(i.d), 0)
    const pctUsed = (furnitureArea / roomArea) * 100
    setErr('')
    setOut({ roomArea: roomArea.toFixed(0), furnitureArea: furnitureArea.toFixed(0), pctUsed: pctUsed.toFixed(0), openArea: (roomArea - furnitureArea).toFixed(0) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Room width (ft)"><input type="number" min="0" value={roomW} onChange={(e) => setRoomW(e.target.value)} /></Field>
        <Field label="Room length (ft)"><input type="number" min="0" value={roomL} onChange={(e) => setRoomL(e.target.value)} /></Field>
      </div>
      {items.map((it, i) => (
        <div className="row" key={it.id}>
          <Field label={`Item ${i + 1}`}><input value={it.name} onChange={(e) => upd(it.id, 'name', e.target.value)} placeholder="e.g. Dining table" /></Field>
          <Field label="Width (ft)"><input type="number" min="0" step="0.1" value={it.w} onChange={(e) => upd(it.id, 'w', e.target.value)} /></Field>
          <Field label="Depth (ft)"><input type="number" min="0" step="0.1" value={it.d} onChange={(e) => upd(it.id, 'd', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setItems((x) => (x.length > 1 ? x.filter((y) => y.id !== it.id) : x))} aria-label={`Remove item ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions">
        <button className="btn ghost" onClick={() => setItems((i) => [...i, blank()])}>Add furniture item</button>
        <button className="btn" onClick={calc}>Calculate</button>
      </div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Room area: <strong>{out.roomArea} sq ft</strong> · Furniture footprint: <strong>{out.furnitureArea} sq ft</strong> (<strong>{out.pctUsed}%</strong>)<br />
          Open floor space: <strong>{out.openArea} sq ft</strong>
          {Number(out.pctUsed) > 50 && <><br /><small>Over 50% furniture coverage often feels cramped — consider fewer or smaller pieces.</small></>}
        </p>
      )}
    </div>
  )
}
