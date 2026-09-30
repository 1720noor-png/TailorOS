import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function NoteFreqCalc() {
  const [note, setNote] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const noteStr=(note||'A4').trim().toUpperCase()
    const m=noteStr.match(/^([A-G])([#B]?)(\d)$/)
    if(!m){setErr('Format: C4, A#3, Bb5');return}
    const names={C:0,D:2,E:4,F:5,G:7,A:9,B:11}
    let semitone=names[m[1]]
    if(m[2]==='#')semitone++;if(m[2]==='B')semitone--
    const midi=(parseInt(m[3])+1)*12+semitone
    const freq=440*Math.pow(2,(midi-69)/12)
    setResult({freq:freq.toFixed(2),midi,note:noteStr})
  }
  return (
    <div>
      <div className="row">
        <Field label="Note (e.g. A4, C5)"><input type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="A4" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>{result.note}:</strong> {result.freq} Hz</p><p>MIDI note: {result.midi}</p></div>}
      <p className="hint">A4 = 440 Hz standard tuning.</p>
    </div>
  )
}
