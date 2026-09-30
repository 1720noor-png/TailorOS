import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function MovingBoxCountCalculator() {
  const [people, setPeople] = useState('2')
  const [homeSize, setHomeSize] = useState('2bed')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const p = parseFloat(people); if (isNaN(p) || p <= 0) return setErr('Enter occupant count.')
      setErr('')
      let baseBoxes = homeSize === 'studio' ? 20 : homeSize === '2bed' ? 40 : homeSize === '3bed' ? 70 : 100
      baseBoxes += (p - 1) * 15
      const small = Math.round(baseBoxes * 0.4)
      const medium = Math.round(baseBoxes * 0.4)
      const large = Math.round(baseBoxes * 0.2)
      setRes({ val: `Total Est. Boxes: ${baseBoxes} (${small} Small, ${medium} Medium, ${large} Large) + 3-5 rolls tape`, copyText: `Est. Moving Boxes: ${baseBoxes} total (${small} S, ${medium} M, ${large} L)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setPeople('2'); setHomeSize('2bed'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="Home Size">
          <select value={homeSize} onChange={(e) => setHomeSize(e.target.value)}>
            <option value="studio">Studio / 1 Bedroom</option>
            <option value="2bed">2 Bedroom Apartment/House</option>
            <option value="3bed">3 Bedroom House</option>
            <option value="4bed">4+ Bedroom House</option>
          </select>
        </Field>
        
        <Field label="Occupants">
          <input type="number"  value={people} onChange={(e) => setPeople(e.target.value)} placeholder="" />
        </Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate / Process</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          {typeof res === 'string' ? (
            <p>Result: <strong>{res}</strong></p>
          ) : (
            <div>
              <p>Result: <strong>{res.val}</strong></p>
            </div>
          )}
          <CopyBtn text={typeof res === 'string' ? res : (res.copyText || JSON.stringify(res))} />
        </div>
      )}
    </div>
  )
}