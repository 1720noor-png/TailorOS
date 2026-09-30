import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

const TASKS = {
  Spring: ['Inspect roof and gutters for winter damage', 'Clean gutters and downspouts', 'Service the AC before summer', 'Check exterior for cracks or peeling paint', 'Test sprinkler system', 'Inspect deck/patio for repairs', 'Check window and door screens'],
  Summer: ['Check and clean AC filters monthly', 'Inspect grill and outdoor equipment', 'Reseal driveway/walkways if needed', 'Check for pests around the foundation', 'Clean dryer vent', 'Inspect caulking around windows'],
  Fall: ['Clean gutters again before leaves finish falling', 'Service the furnace/heating system', 'Drain outdoor hoses and shut off outdoor water', 'Check weatherstripping on doors/windows', 'Rake leaves and clear drains', 'Chimney inspection if used in winter'],
  Winter: ['Check smoke and CO detector batteries', 'Insulate exposed pipes', 'Check attic insulation and ventilation', 'Inspect for ice dam risk', 'Test sump pump', 'Keep walkways clear of ice', 'Change furnace filter'],
}

export default function MaintenanceChecklistGenerator() {
  const [season, setSeason] = useState('Spring')
  const [checked, setChecked] = useState({})
  const list = TASKS[season]
  const toggle = (t) => setChecked((c) => ({ ...c, [season + t]: !c[season + t] }))
  const text = `${season} home maintenance checklist\n\n` + list.map((t) => `[${checked[season + t] ? 'x' : ' '}] ${t}`).join('\n')

  return (
    <div>
      <Field label="Season"><select value={season} onChange={(e) => setSeason(e.target.value)}>{Object.keys(TASKS).map((s) => <option key={s}>{s}</option>)}</select></Field>
      <ul className="checklist">
        {list.map((t) => (
          <li key={t}>
            <label><input type="checkbox" checked={!!checked[season + t]} onChange={() => toggle(t)} /> {t}</label>
          </li>
        ))}
      </ul>
      <div className="actions">
        <CopyBtn text={text} />
        <button className="btn ghost" onClick={() => download(`${season.toLowerCase()}-maintenance-checklist.txt`, text)}>Download</button>
      </div>
    </div>
  )
}
