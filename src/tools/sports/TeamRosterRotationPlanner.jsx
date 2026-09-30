import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function TeamRosterRotationPlanner() {
  const [names, setNames] = useState('')
  const [onField, setOnField] = useState('5')
  const [periods, setPeriods] = useState('4')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const list = names.split('\n').map((s) => s.trim()).filter(Boolean)
    const of = Number(onField), p = Number(periods)
    if (!list.length) { setOut(null); return setErr('Enter at least one player name, one per line.') }
    if (!(of > 0 && p > 0)) { setOut(null); return setErr('Enter players-on-field and number of periods greater than 0.') }
    if (list.length < of) { setOut(null); return setErr(`You have fewer players (${list.length}) than the ${of} needed on the field at once.`) }
    // round-robin rotation: rotate starting index each period so playing time is as equal as possible
    const schedule = []
    for (let period = 0; period < p; period++) {
      const lineup = []
      for (let i = 0; i < of; i++) lineup.push(list[(period * of + i) % list.length])
      schedule.push(lineup)
    }
    setErr(''); setOut(schedule)
  }

  return (
    <div>
      <Field label="Player names (one per line)"><textarea rows={8} value={names} onChange={(e) => setNames(e.target.value)} placeholder={'Sam\nJordan\nCasey'} /></Field>
      <div className="row">
        <Field label="Players on field/court at once"><input type="number" min="1" value={onField} onChange={(e) => setOnField(e.target.value)} /></Field>
        <Field label="Number of periods/quarters"><input type="number" min="1" value={periods} onChange={(e) => setPeriods(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Generate rotation</button></div>
      <Msg>{err}</Msg>
      {out && (
        <div className="out" role="status">
          {out.map((lineup, i) => <p key={i}><strong>Period {i + 1}</strong>: {lineup.join(', ')}</p>)}
        </div>
      )}
      <Msg kind="status">Rotates the starting point through the list each period so playing time stays roughly equal.</Msg>
    </div>
  )
}
