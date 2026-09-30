import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function ServingSizeCalc() {
  const [totalWeight, setTotalWeight] = useState('')
  const [servingWeight, setServingWeight] = useState('')
  const [calories, setCalories] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const tw=parseFloat(totalWeight),sw=parseFloat(servingWeight),cal=parseFloat(calories)
    if(!tw||!sw){setErr('Enter total and serving weight.');return}
    const servings=tw/sw,totalCal=servings*(cal||0)
    setResult({servings:servings.toFixed(1),totalCal:totalCal.toFixed(0)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Total Weight (g)"><input type="number" value={totalWeight} onChange={e=>setTotalWeight(e.target.value)} placeholder="500" /></Field>
        <Field label="Serving Size (g)"><input type="number" value={servingWeight} onChange={e=>setServingWeight(e.target.value)} placeholder="100" /></Field>
        <Field label="Calories per Serving"><input type="number" value={calories} onChange={e=>setCalories(e.target.value)} placeholder="200" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Servings:</strong> {result.servings}</p><p><strong>Total Calories:</strong> {result.totalCal}</p></div>}
      <p className="hint">Calculate number of servings from package.</p>
    </div>
  )
}
