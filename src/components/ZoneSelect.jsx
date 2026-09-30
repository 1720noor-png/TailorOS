import { useMemo, useState } from 'react'
import { Field } from './ui.jsx'
import { zoneList } from '../utils/time.js'
// Filterable time-zone picker built on the browser's own IANA zone list.
export default function ZoneSelect({ label, value, onChange, exclude = [] }) {
  const [q, setQ] = useState('')
  const all = useMemo(zoneList, [])
  const t = q.trim().toLowerCase().replace(/\s+/g, '_')
  const list = all.filter((z) => (z === value || !exclude.includes(z)) && (!t || z.toLowerCase().includes(t)))
  if (value && !list.includes(value)) list.unshift(value)
  return (
    <div>
      <Field label={`${label} – filter`}><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. tokyo, karachi, new york" /></Field>
      <Field label={label}>
        <select value={value} onChange={(e) => onChange(e.target.value)}>{list.map((z) => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}</select>
      </Field>
    </div>
  )
}
