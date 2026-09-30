import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function GroupMaker() {
  const [names, setNames] = useState('')
  const [groupSize, setGroupSize] = useState('4')
  const [groups, setGroups] = useState([])
  const [err, setErr] = useState('')

  const generate = () => {
    setErr(''); setGroups([])
    const list = names.trim().split('\n').filter(n => n.trim())
    if (list.length < 2) { setErr('Enter at least 2 names.'); return }
    const sz = Math.max(2, Number(groupSize) || 4)
    const shuffled = [...list].sort(() => Math.random() - 0.5)
    const gs = []
    for (let i = 0; i < shuffled.length; i += sz) gs.push(shuffled.slice(i, i + sz))
    setGroups(gs)
  }

  const text = groups.map((g, i) => 'Group ' + (i+1) + ': ' + g.join(', ')).join('\n')

  return (
    <div>
      <div className="row">
        <Field label="Student Names (one per line)"><textarea rows={5} value={names} onChange={e => setNames(e.target.value)} placeholder="Alice\nBob\nCharlie" /></Field>
        <Field label="Group Size"><input type="number" min="2" max="20" value={groupSize} onChange={e => setGroupSize(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate Groups</button></div>
      <Msg>{err}</Msg>
      {groups.length > 0 && <div className="out" role="status">
        {groups.map((g, i) => <p key={i}><strong>Group {i + 1}:</strong> {g.join(', ')}</p>)}
        <CopyBtn text={text} />
      </div>}
      <p className="hint">Students are randomly shuffled each time.</p>
    </div>
  )
}
