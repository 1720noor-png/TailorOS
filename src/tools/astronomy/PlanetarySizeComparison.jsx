import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function PlanetarySizeComparison() {
  const [baseBody, setBaseBody] = useState('Earth')

  const bodies = [
    { name: 'Sun', diamKm: 1392700, volRatio: 1300000 },
    { name: 'Jupiter', diamKm: 139822, volRatio: 1321 },
    { name: 'Saturn', diamKm: 116460, volRatio: 764 },
    { name: 'Uranus', diamKm: 50724, volRatio: 63 },
    { name: 'Neptune', diamKm: 49244, volRatio: 58 },
    { name: 'Earth', diamKm: 12742, volRatio: 1 },
    { name: 'Venus', diamKm: 12104, volRatio: 0.86 },
    { name: 'Mars', diamKm: 6779, volRatio: 0.15 },
    { name: 'Moon (Earth)', diamKm: 3474, volRatio: 0.02 },
    { name: 'Mercury', diamKm: 4879, volRatio: 0.056 },
    { name: 'Pluto (Dwarf)', diamKm: 2376, volRatio: 0.006 },
  ]

  const refObj = bodies.find((b) => b.name === baseBody) || bodies[5]

  const reportText = `Planetary Size & Scale Comparison (Base: ${baseBody})
-------------------------------------------------------
Reference Diameter: ${refObj.diamKm.toLocaleString()} km

Comparative Diameter Scale:
${bodies
  .map(
    (b) =>
      `• ${b.name}: ${b.diamKm.toLocaleString()} km (${(b.diamKm / refObj.diamKm).toFixed(2)}x ${baseBody}'s diameter)`
  )
  .join('\n')}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Select Baseline Planet / Body">
          <select value={baseBody} onChange={(e) => setBaseBody(e.target.value)}>
            {bodies.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name} ({b.diamKm.toLocaleString()} km)
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="out">
        <div>Baseline Body: <strong>{refObj.name}</strong> ({refObj.diamKm.toLocaleString()} km diameter)</div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Comparing relative diameters and spherical volume scales across solar system bodies.
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Celestial Body</th>
              <th>Diameter (km)</th>
              <th>Diameter Ratio vs {baseBody}</th>
              <th>Volume Scale vs Earth</th>
            </tr>
          </thead>
          <tbody>
            {bodies.map((b) => {
              const diamRatio = (b.diamKm / refObj.diamKm).toFixed(2)
              return (
                <tr key={b.name} className={b.name === baseBody ? 'best' : ''}>
                  <td><strong>{b.name}</strong></td>
                  <td>{b.diamKm.toLocaleString()} km</td>
                  <td>{diamRatio} x</td>
                  <td>{b.volRatio.toLocaleString()} x Earth</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Size Comparison" />
        <button type="button" className="btn ghost" onClick={() => download('planetary-size-comparison.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
