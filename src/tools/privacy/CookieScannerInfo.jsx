import { useState } from 'react'
export default function CookieScannerInfo() {
  const items = ['Essential/Necessary cookies identified','Analytics cookies listed','Marketing/Advertising cookies listed','Third-party cookies documented','Cookie duration documented','Cookie consent banner implemented','Opt-out mechanism available','Privacy policy mentions cookies','Cookie preference center available','Regular cookie audit scheduled']
  const [checked, setChecked] = useState({})
  const toggle = i => setChecked(p => ({...p, [i]: !p[i]}))
  const done = Object.values(checked).filter(Boolean).length
  return (
    <div>
      <div className="out" role="status">
        <p><strong>Cookie Compliance Score:</strong> {done}/{items.length}</p>
      </div>
      {items.map((item, i) => <label key={i} style={{display:'block',padding:'4px 0'}}><input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} /> {item}</label>)}
      <p className="hint">Website cookie compliance checklist.</p>
    </div>
  )
}
