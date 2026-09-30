import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
const NATO = {A:'Alpha',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliet',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu',0:'Zero',1:'One',2:'Two',3:'Three',4:'Four',5:'Five',6:'Six',7:'Seven',8:'Eight',9:'Niner'}
export default function NatoAlphabet() {
  const [input, setInput] = useState('')
  const result = input.toUpperCase().split('').map(c => NATO[c] || c).join(' ')
  return (
    <div>
      <Field label="Text to Spell"><input value={input} onChange={e => setInput(e.target.value)} placeholder="ALPHA BRAVO" /></Field>
      {input.trim() && <div className="out" role="status"><p style={{fontSize:'1.1rem'}}>{result}</p><CopyBtn text={result} /></div>}
      <p className="hint">NATO phonetic alphabet for clear communication.</p>
    </div>
  )
}
