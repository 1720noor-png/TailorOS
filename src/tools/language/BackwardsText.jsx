import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'
export default function BackwardsText() {
  const [input, setInput] = useState('')
  const reversed = [...input].reverse().join('')
  const wordReversed = input.split(/\s+/).reverse().join(' ')
  return (
    <div>
      <Field label="Text"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Hello World" /></Field>
      {input && <div className="out" role="status">
        <p><strong>Characters:</strong> {reversed}</p>
        <p><strong>Words:</strong> {wordReversed}</p>
        <CopyBtn text={reversed} />
      </div>}
      <p className="hint">Reverse characters or word order.</p>
    </div>
  )
}
