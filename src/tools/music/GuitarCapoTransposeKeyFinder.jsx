import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function GuitarCapoTransposeKeyFinder() {
  const [capoFret, setCapoFret] = useState('3')
  const [openKey, setOpenKey] = useState('G')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const fret = parseInt(capoFret, 10)
      if (isNaN(fret) || fret < 0 || fret > 12) return setErr('Enter fret number between 0 and 12.')
      setErr('')
      const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
      const startIndex = keys.indexOf(openKey)
      const soundingKey = keys[(startIndex + fret) % 12]
      setRes({ val: `Open shape ${openKey} with Capo Fret ${fret} sounds in the Key of ${soundingKey}`, copyText: `Capo ${fret} (${openKey} shape) = Key of ${soundingKey}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setCapoFret('3'); setOpenKey('G'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="Open Fret Key / Chord">
          <select value={openKey} onChange={(e) => setOpenKey(e.target.value)}>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </Field>
        
        <Field label="Capo Fret Number (1 - 12)">
          <input type="number"  value={capoFret} onChange={(e) => setCapoFret(e.target.value)} placeholder="" />
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