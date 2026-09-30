import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function PermutationCalculator() {
  const [n, setN] = useState('')
  const [r, setR] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const ni=parseInt(n),ri=parseInt(r)
    if(isNaN(ni)||isNaN(ri)||ni<0||ri<0||ri>ni){setErr('Enter valid n ≥ r ≥ 0.');return}
    let p=1;for(let i=ni;i>ni-ri;i--)p*=i
    setResult({perm:p,n:ni,r:ri})
  }
  return (
    <div>
      <div className="row">
        <Field label="n (total)"><input type="number" value={n} onChange={e=>setN(e.target.value)} placeholder="10" /></Field>
        <Field label="r (choose)"><input type="number" value={r} onChange={e=>setR(e.target.value)} placeholder="3" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>P({result.n},{result.r}) = {result.perm}</strong></p></div>}
      <p className="hint">P(n,r) = n! / (n-r)!</p>
    </div>
  )
}
