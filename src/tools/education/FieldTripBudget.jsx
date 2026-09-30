import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function FieldTripBudget() {
  const [students, setStudents] = useState('')
  const [transport, setTransport] = useState('')
  const [admission, setAdmission] = useState('')
  const [meals, setMeals] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  const calculate = () => {
    setErr(''); setResult(null)
    const n=Number(students)||0,tr=Number(transport)||0,ad=Number(admission)||0,ml=Number(meals)||0
    if(n<1){setErr('Enter number of students.');return}
    const perStudent=tr/n+ad+ml,total=perStudent*n
    setResult({perStudent:perStudent.toFixed(2),total:total.toFixed(2),n})
  }

  return (
    <div>
      <div className="row">
        <Field label="Students"><input type="number" value={students} onChange={e=>setStudents(e.target.value)} placeholder="30" /></Field>
        <Field label="Transport Cost ($)"><input type="number" value={transport} onChange={e=>setTransport(e.target.value)} placeholder="500" /></Field>
        <Field label="Admission/student ($)"><input type="number" value={admission} onChange={e=>setAdmission(e.target.value)} placeholder="15" /></Field>
        <Field label="Meal/student ($)"><input type="number" value={meals} onChange={e=>setMeals(e.target.value)} placeholder="10" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Per Student:</strong> ${result.perStudent}</p><p><strong>Total ({'{result.n}'} students):</strong> ${result.total}</p></div>}
      <p className="hint">Include all costs for accurate budgeting.</p>
    </div>
  )
}
