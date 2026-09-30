import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function DisposableEmailInfo() {
  const [result, setResult] = useState('')
  const generate = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const name = Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const domains = ['example.com','test.example','demo.example.org','sample.test']
    const domain = domains[Math.floor(Math.random() * domains.length)]
    setResult(name + '@' + domain)
  }
  return (
    <div>
      <div className="actions"><button className="btn" onClick={generate}>Generate Random Email Format</button></div>
      {result && <div className="out" role="status"><p style={{fontSize:'1.2rem',fontWeight:'bold'}}>{result}</p><CopyBtn text={result} /><p style={{color:'#888',fontSize:'.85rem',marginTop:8}}>This is a random format example. Use a real disposable email service for actual temporary emails.</p></div>}
      <p className="hint">Generates random email address formats for testing.</p>
    </div>
  )
}
