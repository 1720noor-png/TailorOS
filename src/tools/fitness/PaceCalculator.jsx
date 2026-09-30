import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function PaceCalculator() {
  const [distKm, setDistKm] = useState(10)
  const [hours, setHours] = useState(0)
  const [mins, setMins] = useState(50)
  const [secs, setSecs] = useState(0)

  const d = Number(distKm) || 0
  const totalSecs = (Number(hours) || 0) * 3600 + (Number(mins) || 0) * 60 + (Number(secs) || 0)

  let paceKmSecs = 0
  let paceMiSecs = 0

  if (d > 0 && totalSecs > 0) {
    paceKmSecs = totalSecs / d
    paceMiSecs = totalSecs / (d * 0.621371)
  }

  const formatPace = (totalSeconds) => {
    if (!totalSeconds || totalSeconds === Infinity) return '00:00'
    const m = Math.floor(totalSeconds / 60)
    const s = Math.floor(totalSeconds % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = Math.floor(totalSeconds % 60)
    if (h > 0) return `${h}h ${m}m ${s}s`
    return `${m}m ${s}s`
  }

  const racePresets = [
    { name: '5K Run', km: 5 },
    { name: '10K Run', km: 10 },
    { name: 'Half Marathon', km: 21.0975 },
    { name: 'Marathon', km: 42.195 },
  ]

  const reportText = `Running Pace & Finish Time Analysis
--------------------------------------------------
Distance: ${d} km (${(d * 0.621371).toFixed(2)} miles)
Total Time: ${formatTime(totalSecs)}

Calculated Paces:
• Pace per Kilometer: ${formatPace(paceKmSecs)} / km
• Pace per Mile: ${formatPace(paceMiSecs)} / mi

Projected Finish Times at this Pace:
${racePresets.map((r) => `• ${r.name}: ${formatTime(r.km * paceKmSecs)}`).join('\n')}`

  return (
    <div className="tool-body">
      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        {racePresets.map((r) => (
          <button
            key={r.name}
            type="button"
            className="btn ghost"
            onClick={() => setDistKm(r.km)}
          >
            {r.name} ({r.km} km)
          </button>
        ))}
      </div>

      <div className="row">
        <Field label="Distance (Kilometers)">
          <input type="number" step="0.1" min="0.1" value={distKm} onChange={(e) => setDistKm(e.target.value)} />
        </Field>
        <Field label="Hours">
          <input type="number" min="0" value={hours} onChange={(e) => setHours(e.target.value)} />
        </Field>
        <Field label="Minutes">
          <input type="number" min="0" max="59" value={mins} onChange={(e) => setMins(e.target.value)} />
        </Field>
        <Field label="Seconds">
          <input type="number" min="0" max="59" value={secs} onChange={(e) => setSecs(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Kilometer Pace: <strong>{formatPace(paceKmSecs)} / km</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Mile Pace: <strong>{formatPace(paceMiSecs)} / mi</strong> | Total Duration: {formatTime(totalSecs)}
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Race Event</th>
              <th>Distance</th>
              <th>Projected Time at Current Pace</th>
            </tr>
          </thead>
          <tbody>
            {racePresets.map((r) => (
              <tr key={r.name} className={Math.abs(r.km - d) < 0.1 ? 'best' : ''}>
                <td><strong>{r.name}</strong></td>
                <td>{r.km} km ({ (r.km * 0.621371).toFixed(1) } mi)</td>
                <td>{formatTime(r.km * paceKmSecs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <CopyBtn text={reportText} label="Copy Pace Summary" />
        <button type="button" className="btn ghost" onClick={() => download('pace-report.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
