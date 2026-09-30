import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
const CODES=[{"code":"200","text":"OK","desc":"Request succeeded"},{"code":"201","text":"Created","desc":"Resource created"},{"code":"204","text":"No Content","desc":"Success with no body"},{"code":"301","text":"Moved Permanently","desc":"Permanent redirect"},{"code":"302","text":"Found","desc":"Temporary redirect"},{"code":"304","text":"Not Modified","desc":"Cached version valid"},{"code":"400","text":"Bad Request","desc":"Invalid request syntax"},{"code":"401","text":"Unauthorized","desc":"Authentication required"},{"code":"403","text":"Forbidden","desc":"Access denied"},{"code":"404","text":"Not Found","desc":"Resource does not exist"},{"code":"405","text":"Method Not Allowed","desc":"HTTP method not supported"},{"code":"409","text":"Conflict","desc":"Request conflicts with current state"},{"code":"422","text":"Unprocessable Entity","desc":"Validation failed"},{"code":"429","text":"Too Many Requests","desc":"Rate limit exceeded"},{"code":"500","text":"Internal Server Error","desc":"Server error"},{"code":"502","text":"Bad Gateway","desc":"Invalid upstream response"},{"code":"503","text":"Service Unavailable","desc":"Server temporarily down"},{"code":"504","text":"Gateway Timeout","desc":"Upstream timeout"}]
export default function HttpStatusLookup() {
  const [q, setQ] = useState('')
  const filtered = CODES.filter(c => !q.trim() || c.code.includes(q) || c.text.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <Field label="Search by code or text"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="404" /></Field>
      <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th style={{textAlign:'left',padding:'4px'}}>Code</th><th style={{textAlign:'left',padding:'4px'}}>Status</th><th style={{textAlign:'left',padding:'4px'}}>Description</th></tr></thead>
          <tbody>{filtered.map(c => <tr key={c.code}><td style={{padding:'4px',fontWeight:'bold'}}>{c.code}</td><td style={{padding:'4px'}}>{c.text}</td><td style={{padding:'4px',color:'#666'}}>{c.desc}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="hint">Quick reference for HTTP status codes.</p>
    </div>
  )
}
