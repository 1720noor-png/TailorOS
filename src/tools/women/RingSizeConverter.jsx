import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
const SIZES = [
  {us:'4',uk:'H',eu:'46.8',mm:'14.9'},{us:'5',uk:'J',eu:'49.3',mm:'15.7'},
  {us:'6',uk:'L',eu:'51.9',mm:'16.5'},{us:'7',uk:'N',eu:'54.4',mm:'17.3'},
  {us:'8',uk:'P',eu:'57.0',mm:'18.1'},{us:'9',uk:'R',eu:'59.5',mm:'19.0'},
  {us:'10',uk:'T',eu:'62.1',mm:'19.8'},{us:'11',uk:'V',eu:'64.6',mm:'20.6'},
]
export default function RingSizeConverter() {
  const [q, setQ] = useState('')
  const f = SIZES.filter(s => !q.trim() || Object.values(s).some(v => v.includes(q)))
  return (
    <div>
      <Field label="Search Size"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="7 or 17.3mm" /></Field>
      <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th style={{padding:'4px 8px'}}>US</th><th style={{padding:'4px 8px'}}>UK</th><th style={{padding:'4px 8px'}}>EU</th><th style={{padding:'4px 8px'}}>mm</th></tr></thead>
          <tbody>{f.map((s,i) => <tr key={i}><td style={{padding:'4px 8px',textAlign:'center'}}>{s.us}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{s.uk}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{s.eu}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{s.mm}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="hint">Ring size conversion chart.</p>
    </div>
  )
}
