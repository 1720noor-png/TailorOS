import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

export default function TournamentBracketGenerator() {
  const [names, setNames] = useState('')
  const [seedMode, setSeedMode] = useState('Random')
  const [err, setErr] = useState('')
  const [rounds, setRounds] = useState(null)

  const generate = () => {
    let list = names.split('\n').map((s) => s.trim()).filter(Boolean)
    if (list.length < 2) { setRounds(null); return setErr('Enter at least 2 team/player names, one per line.') }
    if (seedMode === 'Random') list = shuffle(list)
    const size = Math.pow(2, Math.ceil(Math.log2(list.length)))
    const byes = size - list.length
    const bracket = [...list]
    for (let i = 0; i < byes; i++) bracket.push('BYE')
    // seed pairing 1 vs last etc for fairness, alternating
    let round1 = []
    for (let i = 0; i < size / 2; i++) round1.push([bracket[i], bracket[size - 1 - i]])
    const allRounds = [round1]
    let count = size / 2
    while (count > 1) { count = count / 2; allRounds.push(Array.from({ length: count }, () => ['TBD', 'TBD'])) }
    setErr(''); setRounds(allRounds)
  }

  return (
    <div>
      <Field label="Team / player names (one per line)"><textarea rows={8} value={names} onChange={(e) => setNames(e.target.value)} placeholder={'Team A\nTeam B\nTeam C'} /></Field>
      <Field label="Seeding"><select value={seedMode} onChange={(e) => setSeedMode(e.target.value)}><option>Random</option><option>Keep order (as typed)</option></select></Field>
      <div className="actions"><button className="btn" onClick={generate}>Generate bracket</button></div>
      <Msg>{err}</Msg>
      {rounds && (
        <div className="out" role="status">
          {rounds.map((round, ri) => (
            <div key={ri}>
              <strong>Round {ri + 1}</strong>
              {round.map((match, mi) => <p key={mi}>{match[0]} vs {match[1]}</p>)}
            </div>
          ))}
          <small>Later rounds fill in as winners advance.</small>
        </div>
      )}
    </div>
  )
}
