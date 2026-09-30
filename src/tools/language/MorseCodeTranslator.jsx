import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
const MORSE = {A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.',' ':'/'}
const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k,v])=>[v,k]))
export default function MorseCodeTranslator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const [mode, setMode] = useState('encode')
  const process = () => {
    setErr(''); setResult('')
    if (!input.trim()) { setErr('Enter text.'); return }
    if (mode === 'encode') {
      setResult(input.toUpperCase().split('').map(c => MORSE[c] || c).join(' '))
    } else {
      setResult(input.split(' ').map(code => REVERSE[code] || code).join(''))
    }
  }
  return (
    <div>
      <div className="row">
        <label><input type="radio" checked={mode==='encode'} onChange={()=>setMode('encode')} /> Text → Morse</label>
        <label><input type="radio" checked={mode==='decode'} onChange={()=>setMode('decode')} /> Morse → Text</label>
      </div>
      <Field label={mode==='encode'?'Text':'Morse Code'}><textarea rows={3} value={input} onChange={e=>setInput(e.target.value)} placeholder={mode==='encode'?'HELLO WORLD':'.... . .-.. .-.. ---'} /></Field>
      <div className="actions"><button className="btn" onClick={process}>Translate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><CopyBtn text={result} /></div>}
      <p className="hint">International Morse Code standard.</p>
    </div>
  )
}
