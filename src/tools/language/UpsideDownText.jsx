import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'
const MAP = {a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',A:'∀',B:'q',C:'Ɔ',D:'p',E:'Ǝ',F:'Ⅎ',G:'פ',H:'H',I:'I',J:'ɾ',K:'ʞ',L:'˥',M:'W',N:'N',O:'O',P:'Ԁ',Q:'Q',R:'ɹ',S:'S',T:'┴',U:'∩',V:'Λ',W:'M',X:'X',Y:'⅄',Z:'Z','1':'Ɩ','2':'ᄅ','3':'Ɛ','4':'ㄣ','5':'ϛ','6':'9','7':'ㄥ','8':'8','9':'6','0':'0','.':'˙',',':'\'','?':'¿','!':'¡','"':',,','\'':',','(':')',')':'(','[':']',']':'[','{':'}','}':'{','<':'>','>':'<','_':'‾'}
export default function UpsideDownText() {
  const [input, setInput] = useState('')
  const flipped = [...input].map(c => MAP[c] || c).reverse().join('')
  return (
    <div>
      <Field label="Text"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Hello World" /></Field>
      {input && <div className="out" role="status"><p style={{fontSize:'1.3rem'}}>{flipped}</p><CopyBtn text={flipped} /></div>}
      <p className="hint">Flip text upside down using Unicode characters.</p>
    </div>
  )
}
