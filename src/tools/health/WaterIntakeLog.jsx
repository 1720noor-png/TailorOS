import { useState } from 'react'
export default function WaterIntakeLog() {
  const [glasses, setGlasses] = useState(0)
  const goal = 8
  const pct = Math.min(100, Math.round(glasses / goal * 100))
  return (
    <div>
      <div className="out" role="status" style={{textAlign:'center'}}>
        <p style={{fontSize:'3rem'}}>{'💧'.repeat(Math.min(glasses, goal))}{'⬜'.repeat(Math.max(0, goal - glasses))}</p>
        <p style={{fontSize:'1.5rem',fontWeight:'bold'}}>{glasses} / {goal} glasses</p>
        <div style={{background:'#e2e8f0',borderRadius:8,height:12,marginTop:8}}>
          <div style={{background:'#3182ce',height:12,borderRadius:8,width:pct+'%',transition:'width .3s'}} />
        </div>
        <p>{pct}% of daily goal</p>
      </div>
      <div className="actions" style={{justifyContent:'center'}}>
        <button className="btn" onClick={() => setGlasses(g => g + 1)}>+ Add Glass</button>
        <button className="btn ghost" onClick={() => setGlasses(g => Math.max(0, g - 1))}>- Remove</button>
        <button className="btn ghost" onClick={() => setGlasses(0)}>Reset</button>
      </div>
      <p className="hint">Track 8 glasses (8 oz each) per day.</p>
    </div>
  )
}
