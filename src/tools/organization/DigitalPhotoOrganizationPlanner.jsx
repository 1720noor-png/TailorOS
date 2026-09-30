import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function DigitalPhotoOrganizationPlanner() {
  const [totalPhotos, setTotalPhotos] = useState('5000')
  const [perDay, setPerDay] = useState('50')
  const [structure, setStructure] = useState('Year / Month / Event')

  const total = Number(totalPhotos) || 0
  const rate = Number(perDay) || 1
  const days = rate > 0 ? Math.ceil(total / rate) : 0

  const EXAMPLES = {
    'Year / Month / Event': '2026/03-March/2026-03-15_Beach-Trip/',
    'Year / Event only': '2026/2026-03-15_Beach-Trip/',
    'Event / Date only': 'Beach-Trip_2026-03-15/',
  }

  return (
    <div>
      <div className="row">
        <Field label="Total photos to sort"><input type="number" min="0" value={totalPhotos} onChange={(e) => setTotalPhotos(e.target.value)} /></Field>
        <Field label="Photos you can sort per day"><input type="number" min="1" value={perDay} onChange={(e) => setPerDay(e.target.value)} /></Field>
      </div>
      <Field label="Folder structure"><select value={structure} onChange={(e) => setStructure(e.target.value)}>{Object.keys(EXAMPLES).map((s) => <option key={s}>{s}</option>)}</select></Field>
      <p className="out" role="status">At {rate}/day, sorting {total.toLocaleString()} photos will take about <strong>{days} day{days === 1 ? '' : 's'}</strong>.</p>
      <Msg kind="status">Example path: {EXAMPLES[structure]}</Msg>
    </div>
  )
}
