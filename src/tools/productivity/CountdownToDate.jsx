import { useState, useEffect } from 'react'
import { Field } from '../../components/ui.jsx'
export default function CountdownToDate() {
  const [target, setTarget] = useState('')
  const [label, setLabel] = useState('')
  const [diff, setDiff] = useState(null)
  useEffect(() => {
    if (!target) { setDiff(null); return }
    const update = () => {
      const ms = new Date(target).getTime() - Date.now()
      if (ms <= 0) { setDiff({d:0,h:0,m:0,s:0,past:true}); return }
      setDiff({d:Math.floor(ms/86400000),h:Math.floor((ms%86400000)/3600000),m:Math.floor((ms%3600000)/60000),s:Math.floor((ms%60000)/1000)})
    }; update()
    const id = setInterval(update, 1000); return () => clearInterval(id)
  }, [target])
  return (
    <div>
      <div className="row">
        <Field label="Event Name"><input value={label} onChange={e => setLabel(e.target.value)} placeholder="My Birthday" /></Field>
        <Field label="Target Date"><input type="datetime-local" value={target} onChange={e => setTarget(e.target.value)} /></Field>
      </div>
      {diff && <div className="out" role="status" style={{textAlign:'center'}}>
        {label && <p style={{fontSize:'1.2rem',marginBottom:8}}>{label}</p>}
        {diff.past ? <p style={{fontSize:'1.5rem',color:'var(--red,#e53e3e)'}}>Event has passed!</p> :
          <div style={{display:'flex',justifyContent:'center',gap:16}}>
            {[['d','Days'],['h','Hours'],['m','Minutes'],['s','Seconds']].map(([k,l]) => (
              <div key={k} style={{textAlign:'center'}}>
                <p style={{fontSize:'2.5rem',fontWeight:'bold',fontVariantNumeric:'tabular-nums'}}>{diff[k]}</p>
                <p style={{fontSize:'.75rem',color:'#888'}}>{l}</p>
              </div>
            ))}
          </div>
        }
      </div>}
      <p className="hint">Live countdown to any date.</p>
    </div>
  )
}
