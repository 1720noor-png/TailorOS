import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function BmiPercentile() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const w=parseFloat(weight),h=parseFloat(height)/100,a=parseInt(age)
    if(!w||!h){setErr('Enter weight and height.');return}
    const bmi=w/(h*h)
    let cat='Normal'
    if(bmi<18.5)cat='Underweight';else if(bmi<25)cat='Normal';else if(bmi<30)cat='Overweight';else cat='Obese'
    setResult({bmi:bmi.toFixed(1),cat})
  }
  return (
    <div>
      <div className="row">
        <Field label="Weight (kg)"><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="70" /></Field>
        <Field label="Height (cm)"><input type="number" value={height} onChange={e=>setHeight(e.target.value)} placeholder="175" /></Field>
        <Field label="Age"><input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="30" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>BMI:</strong> {result.bmi}</p><p><strong>Category:</strong> {result.cat}</p></div>}
      <p className="hint">BMI = weight(kg) / height(m)². Consult your doctor.</p>
    </div>
  )
}
