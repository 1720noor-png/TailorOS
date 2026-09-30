import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

const CHECKLIST = {
  'Auto accident': ['Photos of all vehicle damage', 'Photos of the scene and license plates', 'Police report number', 'Other driver\u2019s insurance info', 'Witness names and contact info', 'Repair estimates'],
  'Home/property damage': ['Photos and video of all damage', 'List of damaged/destroyed items with value', 'Receipts or proof of purchase if available', 'Repair contractor estimates', 'Police report (if theft/vandalism)'],
  'Health/medical': ['Itemized medical bills', 'Explanation of Benefits (EOB) from insurer', 'Doctor\u2019s notes/diagnosis paperwork', 'Prescription receipts'],
  'Travel': ['Original booking confirmations', 'Proof of trip cancellation/delay (airline notice)', 'Receipts for additional expenses incurred', 'Boarding passes / itineraries'],
}

export default function InsuranceClaimDocumentationChecklist() {
  const [type, setType] = useState('Auto accident')
  const [checked, setChecked] = useState({})
  const list = CHECKLIST[type]
  const toggle = (item) => setChecked((c) => ({ ...c, [type + item]: !c[type + item] }))
  const text = `${type} claim documentation checklist\n\n` + list.map((i) => `[${checked[type + i] ? 'x' : ' '}] ${i}`).join('\n')

  return (
    <div>
      <Field label="Claim type"><select value={type} onChange={(e) => setType(e.target.value)}>{Object.keys(CHECKLIST).map((t) => <option key={t}>{t}</option>)}</select></Field>
      <ul className="checklist">
        {list.map((i) => (
          <li key={i}><label><input type="checkbox" checked={!!checked[type + i]} onChange={() => toggle(i)} /> {i}</label></li>
        ))}
      </ul>
      <div className="actions"><CopyBtn text={text} /></div>
    </div>
  )
}
