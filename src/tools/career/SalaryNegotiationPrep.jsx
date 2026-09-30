import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function SalaryNegotiationPrep() {
  const [current, setCurrent] = useState('')
  const [target, setTarget] = useState('')
  const [market, setMarket] = useState('')
  const [strengths, setStrengths] = useState('')
  const [result, setResult] = useState('')
  const generate = () => {
    if (!target.trim()) { setResult(''); return }
    const c = parseFloat(current) || 0, t = parseFloat(target) || 0
    const increase = c ? ((t - c) / c * 100).toFixed(1) : 'N/A'
    setResult('SALARY NEGOTIATION BRIEF\n' + '═'.repeat(30) + '\n\nCurrent: $' + (c||'N/A') + '\nTarget: $' + t + '\nIncrease: ' + increase + '%\nMarket Rate: $' + (market||'Research needed') + '\n\nKey Strengths:\n' + (strengths || 'List your achievements') + '\n\nTalking Points:\n1. Market data supports this range\n2. My contributions include [specific achievements]\n3. I am committed to continued growth\n\nPrepared: ' + new Date().toLocaleDateString())
  }
  return (
    <div>
      <div className="row">
        <Field label="Current Salary ($)"><input type="number" value={current} onChange={e=>setCurrent(e.target.value)} /></Field>
        <Field label="Target Salary ($)"><input type="number" value={target} onChange={e=>setTarget(e.target.value)} /></Field>
        <Field label="Market Rate ($)"><input type="number" value={market} onChange={e=>setMarket(e.target.value)} /></Field>
      </div>
      <Field label="Key Strengths/Achievements"><textarea rows={3} value={strengths} onChange={e=>setStrengths(e.target.value)} placeholder="Led project X, increased revenue by Y%" /></Field>
      <div className="actions"><button className="btn" onClick={generate}>Generate Brief</button></div>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><CopyBtn text={result} /></div>}
      <p className="hint">Prepare data-backed negotiation points.</p>
    </div>
  )
}
