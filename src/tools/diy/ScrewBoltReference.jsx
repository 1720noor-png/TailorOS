import { useState } from 'react'
import { Field } from '../../components/ui.jsx'

const DATA = [{"Term":"Example 1","Description":"Description of item 1","Category":"General"},{"Term":"Example 2","Description":"Description of item 2","Category":"General"},{"Term":"Example 3","Description":"Description of item 3","Category":"Specific"}]

export default function ScrewBoltReference() {
  const [query, setQuery] = useState('')
  const filtered = DATA.filter(d => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return Object.values(d).some(v => String(v).toLowerCase().includes(q))
  })

  return (
    <div>
      <Field label="Search"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Type to search..." /></Field>
      <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.85rem'}}>
          <thead><tr>{Object.keys(DATA[0]||{}).map(k => <th key={k} style={{textAlign:'left',padding:'4px 8px',borderBottom:'1px solid #e2e8f0'}}>{k}</th>)}</tr></thead>
          <tbody>{filtered.slice(0,50).map((row,i) => (
            <tr key={i}>{Object.values(row).map((v,j) => <td key={j} style={{padding:'4px 8px',borderBottom:'1px solid #f0f0f0'}}>{v}</td>)}</tr>
          ))}</tbody>
        </table>
        <p style={{marginTop:8,fontSize:'.85rem',color:'#888'}}>Showing {Math.min(filtered.length,50)} of {filtered.length} results</p>
      </div>
      <p className="hint">Type to filter results.</p>
    </div>
  )
}
