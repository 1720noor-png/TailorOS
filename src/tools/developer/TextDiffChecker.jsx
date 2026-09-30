import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function TextDiffChecker() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  const compare = () => {
    setErr(''); setResult(null)
    if (!text1.trim() && !text2.trim()) { setErr('Paste both texts.'); return }
    const lines1 = text1.split('\n'), lines2 = text2.split('\n')
    const maxLen = Math.max(lines1.length, lines2.length)
    const diffs = []
    let same = 0, changed = 0, added = 0, removed = 0
    for (let i = 0; i < maxLen; i++) {
      const l1 = lines1[i], l2 = lines2[i]
      if (l1 === l2) { diffs.push({ type: 'same', line: i + 1, text: l1 || '' }); same++ }
      else if (l1 === undefined) { diffs.push({ type: 'added', line: i + 1, text: l2 }); added++ }
      else if (l2 === undefined) { diffs.push({ type: 'removed', line: i + 1, text: l1 }); removed++ }
      else { diffs.push({ type: 'changed', line: i + 1, old: l1, new: l2 }); changed++ }
    }
    setResult({ diffs, same, changed, added, removed })
  }

  const colors = { same: 'inherit', added: '#c6f6d5', removed: '#fed7d7', changed: '#fefcbf' }

  return (
    <div>
      <div className="row">
        <Field label="Text A"><textarea rows={8} value={text1} onChange={e => setText1(e.target.value)} placeholder="Original text" style={{ fontFamily: 'monospace', fontSize: '.85rem' }} /></Field>
        <Field label="Text B"><textarea rows={8} value={text2} onChange={e => setText2(e.target.value)} placeholder="Modified text" style={{ fontFamily: 'monospace', fontSize: '.85rem' }} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={compare}>Compare</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <p><strong>Summary:</strong> {result.same} identical, {result.changed} changed, {result.added} added, {result.removed} removed</p>
        <div style={{ maxHeight: 400, overflow: 'auto', fontSize: '.85rem', fontFamily: 'monospace' }}>
          {result.diffs.map((d, i) => (
            <div key={i} style={{ background: colors[d.type], padding: '2px 8px', borderBottom: '1px solid #eee' }}>
              <span style={{ color: '#888', marginRight: 8 }}>{d.line}</span>
              {d.type === 'changed' ? <>
                <div style={{ color: '#c53030' }}>- {d.old}</div>
                <div style={{ color: '#276749' }}>+ {d.new}</div>
              </> : <>
                <span>{d.type === 'added' ? '+ ' : d.type === 'removed' ? '- ' : '  '}{d.text}</span>
              </>}
            </div>
          ))}
        </div>
      </div>}
      <p className="hint">Compare two texts line by line.</p>
    </div>
  )
}
