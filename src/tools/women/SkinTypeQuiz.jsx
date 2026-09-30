import { useState } from 'react'
export default function SkinTypeQuiz() {
  const questions = [
    {q:'How does your skin feel after washing?',opts:[['Tight and dry',0],['Comfortable',1],['Oily in T-zone',2],['Oily all over',3]]},
    {q:'How often do you get breakouts?',opts:[['Rarely',0],['Occasionally',1],['Often in T-zone',2],['Frequently all over',3]]},
    {q:'How visible are your pores?',opts:[['Barely visible',0],['Small',1],['Visible on nose/forehead',2],['Large everywhere',3]]},
    {q:'Does your skin react to new products?',opts:[['Often irritated',4],['Sometimes',1],['Rarely',1],['Never',1]]},
  ]
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState('')
  const answer = (qi, val) => setAnswers({...answers, [qi]: val})
  const analyze = () => {
    const vals = Object.values(answers)
    if (vals.length < questions.length) { setResult('Answer all questions.'); return }
    const sum = vals.reduce((a,b)=>a+b, 0)
    if (vals.includes(4)) setResult('🧴 Sensitive Skin — Use gentle, fragrance-free products.')
    else if (sum <= 2) setResult('🏜️ Dry Skin — Use rich moisturizers and hydrating serums.')
    else if (sum <= 5) setResult('✨ Normal/Combination — Balanced routine, light moisturizer.')
    else if (sum <= 8) setResult('💧 Combination — Different products for T-zone and cheeks.')
    else setResult('🫧 Oily Skin — Use oil-free products and gentle cleansers.')
  }
  return (
    <div>
      {questions.map((q, qi) => (
        <div key={qi} style={{marginBottom:16}}>
          <p style={{fontWeight:'bold'}}>{qi+1}. {q.q}</p>
          {q.opts.map(([text, val], oi) => (
            <label key={oi} style={{display:'block',padding:'2px 0'}}><input type="radio" name={'q'+qi} checked={answers[qi]===val} onChange={()=>answer(qi,val)} /> {text}</label>
          ))}
        </div>
      ))}
      <div className="actions"><button className="btn" onClick={analyze}>Analyze</button></div>
      {result && <div className="out" role="status"><p style={{fontSize:'1.1rem'}}>{result}</p></div>}
      <p className="hint">General guidance only. Consult a dermatologist.</p>
    </div>
  )
}
