import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
const ROLES = [
  {Role:'alert',Type:'Widget',Desc:'Important message, often time-sensitive'},
  {Role:'alertdialog',Type:'Widget',Desc:'Alert that requires user response'},
  {Role:'button',Type:'Widget',Desc:'Clickable interactive element'},
  {Role:'checkbox',Type:'Widget',Desc:'Checkable input with true/false/mixed'},
  {Role:'dialog',Type:'Widget',Desc:'Application dialog window'},
  {Role:'link',Type:'Widget',Desc:'Hyperlink to a resource'},
  {Role:'menu',Type:'Widget',Desc:'List of choices/actions'},
  {Role:'progressbar',Type:'Widget',Desc:'Task completion progress'},
  {Role:'slider',Type:'Widget',Desc:'Selectable value from range'},
  {Role:'tab',Type:'Widget',Desc:'Tab in tabbed interface'},
  {Role:'tabpanel',Type:'Widget',Desc:'Container for tab content'},
  {Role:'navigation',Type:'Landmark',Desc:'Navigation links section'},
  {Role:'main',Type:'Landmark',Desc:'Main content of document'},
  {Role:'banner',Type:'Landmark',Desc:'Site-oriented content (header)'},
  {Role:'complementary',Type:'Landmark',Desc:'Supporting content (aside)'},
  {Role:'contentinfo',Type:'Landmark',Desc:'Info about document (footer)'},
  {Role:'search',Type:'Landmark',Desc:'Search functionality'},
  {Role:'form',Type:'Landmark',Desc:'Landmark region with form'},
  {Role:'region',Type:'Landmark',Desc:'Perceivable section of page'},
  {Role:'img',Type:'Structure',Desc:'Image container'},
  {Role:'list',Type:'Structure',Desc:'Group of list items'},
  {Role:'listitem',Type:'Structure',Desc:'Single item in a list'},
]
export default function AriaRoleReference() {
  const [q, setQ] = useState('')
  const f = ROLES.filter(r => !q.trim() || r.Role.includes(q.toLowerCase()) || r.Desc.toLowerCase().includes(q.toLowerCase()) || r.Type.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <Field label="Search Roles"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="button, navigation..." /></Field>
      <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.85rem'}}>
          <thead><tr><th style={{textAlign:'left',padding:'4px 8px'}}>Role</th><th style={{padding:'4px 8px'}}>Type</th><th style={{textAlign:'left',padding:'4px 8px'}}>Description</th></tr></thead>
          <tbody>{f.map((r,i)=><tr key={i}><td style={{padding:'4px 8px'}}><code>{r.Role}</code></td><td style={{padding:'4px 8px',textAlign:'center'}}>{r.Type}</td><td style={{padding:'4px 8px',color:'#666'}}>{r.Desc}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="hint">WAI-ARIA roles for accessible web content.</p>
    </div>
  )
}
