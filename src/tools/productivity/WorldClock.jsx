import { useEffect, useState } from 'react'
import { useStored } from '../../components/hooks.js'
import { Msg } from '../../components/ui.jsx'
import ZoneSelect from '../../components/ZoneSelect.jsx'
import { localZone, zoneName, zoneOk, offsetMs, fmtOffset, fmtClock, fmtDate } from '../../utils/time.js'

const defaults = () => [...new Set([localZone(), 'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'])]
export default function WorldClock() {
  const [zones, setZones] = useStored('toolhub.worldclock', defaults())
  const [pick, setPick] = useState('Europe/Paris')
  const [h12, setH12] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [err, setErr] = useState('')
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const valid = zones.filter(zoneOk)
  const add = () => {
    if (!zoneOk(pick)) return setErr('That time zone is not supported by this browser.')
    if (valid.includes(pick)) return setErr('That city is already on your clock list.')
    if (valid.length >= 24) return setErr('You can show up to 24 clocks. Remove one first.')
    setZones([...valid, pick]); setErr('')
  }
  return (
    <div>
      <ZoneSelect label="Add a city / time zone" value={pick} onChange={setPick} exclude={valid} />
      <div className="actions">
        <button className="btn" onClick={add}>Add clock</button>
        <label className="check"><input type="checkbox" checked={h12} onChange={(e) => setH12(e.target.checked)} /> 12-hour format</label>
        <button className="btn ghost" onClick={() => { setZones(defaults()); setErr('') }}>Reset to defaults</button>
      </div>
      <Msg>{err}</Msg>
      {!valid.length ? <div className="empty"><p>No clocks yet. Add a time zone above.</p></div> :
        <div className="grid" role="list">
          {valid.map((z) => (
            <div className="tool" role="listitem" key={z}>
              <h3>{zoneName(z)}{z === localZone() ? ' (your time zone)' : ''}</h3>
              <p className="tzt">{fmtClock(now, z, h12)}</p>
              <p>{fmtDate(now, z)}</p>
              <p>{fmtOffset(offsetMs(now, z))} · {z}</p>
              <button className="btn ghost" style={{ marginTop: '.6rem', alignSelf: 'flex-start' }} onClick={() => setZones(valid.filter((x) => x !== z))} aria-label={`Remove ${zoneName(z)}`}>Remove</button>
            </div>
          ))}
        </div>}
      <p className="hint">Times come from your device clock and your browser’s built-in time-zone data, including daylight saving. Nothing is fetched online. Your list is saved only in this browser.</p>
    </div>
  )
}
