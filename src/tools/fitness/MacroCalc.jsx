import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function MacroCalc() {
  const [calories, setCalories] = useState('')
  const [proteinPct, setProteinPct] = useState('')
  const [carbPct, setCarbPct] = useState('')
  const [fatPct, setFatPct] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const cal=parseFloat(calories),pp=parseFloat(proteinPct),cp=parseFloat(carbPct),fp=parseFloat(fatPct)
    if(!cal){setErr('Enter calories.');return}
    if(Math.abs(pp+cp+fp-100)>1){setErr('Percentages should sum to 100.');return}
    const pg=Math.round(cal*pp/100/4),cg=Math.round(cal*cp/100/4),fg=Math.round(cal*fp/100/9)
    setResult({protein:pg,carbs:cg,fat:fg})
  }
  return (
    <div>
      <div className="row">
        <Field label="Daily Calories"><input type="number" value={calories} onChange={e=>setCalories(e.target.value)} placeholder="2000" /></Field>
        <Field label="Protein %"><input type="number" value={proteinPct} onChange={e=>setProteinPct(e.target.value)} placeholder="30" /></Field>
        <Field label="Carb %"><input type="number" value={carbPct} onChange={e=>setCarbPct(e.target.value)} placeholder="40" /></Field>
        <Field label="Fat %"><input type="number" value={fatPct} onChange={e=>setFatPct(e.target.value)} placeholder="30" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Protein:</strong> {result.protein}g | <strong>Carbs:</strong> {result.carbs}g | <strong>Fat:</strong> {result.fat}g</p></div>}
      <p className="hint">Protein & carbs = 4 cal/g, fat = 9 cal/g.</p>
    </div>
  )
}
