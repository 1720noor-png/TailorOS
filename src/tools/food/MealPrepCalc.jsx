import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function MealPrepCalc() {
  const [servings, setServings] = useState('')
  const [originalServ, setOriginalServ] = useState('')
  const [ingredient, setIngredient] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const need=parseFloat(servings),orig=parseFloat(originalServ),ing=parseFloat(ingredient)
    if(!need||!orig||!ing){setErr('Fill all fields.');return}
    const factor=need/orig,scaled=(ing*factor).toFixed(0)
    setResult({factor:factor.toFixed(2),scaled,servings:need})
  }
  return (
    <div>
      <div className="row">
        <Field label="Servings Needed"><input type="number" value={servings} onChange={e=>setServings(e.target.value)} placeholder="5" /></Field>
        <Field label="Recipe Serves"><input type="number" value={originalServ} onChange={e=>setOriginalServ(e.target.value)} placeholder="2" /></Field>
        <Field label="Main Ingredient (g)"><input type="number" value={ingredient} onChange={e=>setIngredient(e.target.value)} placeholder="200" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Scale factor:</strong> {result.factor}x</p><p><strong>Ingredient needed:</strong> {result.scaled}g for {result.servings} servings</p></div>}
      <p className="hint">Scale recipes for meal prep batches.</p>
    </div>
  )
}
