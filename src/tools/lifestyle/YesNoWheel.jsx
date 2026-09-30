import { useState } from 'react'
export default function YesNoWheel() {
  const [result, setResult] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const spin = () => {
    setSpinning(true); setResult(null)
    let count = 0
    const id = setInterval(() => {
      setResult(Math.random() > 0.5 ? '✅ YES' : '❌ NO')
      count++
      if (count > 15) { clearInterval(id); setSpinning(false) }
    }, 100 + count * 20)
  }
  return (
    <div>
      <div className="out" role="status" style={{textAlign:'center',padding:32}}>
        <p style={{fontSize:'4rem',fontWeight:'bold',transition:'all .1s'}}>{result || '❓'}</p>
      </div>
      <div className="actions" style={{justifyContent:'center'}}>
        <button className="btn" onClick={spin} disabled={spinning} style={{padding:'12px 48px',fontSize:'1.2rem'}}>{spinning ? 'Deciding...' : 'Decide!'}</button>
      </div>
      <p className="hint">Let fate decide for you.</p>
    </div>
  )
}
