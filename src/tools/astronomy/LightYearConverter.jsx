import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function LightYearConverter() {
  const [ly, setLy] = useState(4.246) // Proxima Centauri distance

  const val = Number(ly) || 0

  // 1 Light-Year = 9.4607 × 10^12 km = 5.8786 × 10^12 miles = 63,241.1 AU = 0.306601 Parsecs
  const km = val * 9.4607e12
  const miles = val * 5.8786e12
  const au = val * 63241.1
  const parsecs = val * 0.306601

  const fmtExp = (n) => n.toExponential(4).replace('e', ' × 10^')

  const presets = [
    { name: 'Proxima Centauri (Nearest Star)', ly: 4.246 },
    { name: 'Sirius (Dog Star)', ly: 8.611 },
    { name: 'Andromeda Galaxy (M31)', ly: 2537000 },
    { name: 'Center of Milky Way', ly: 26000 },
  ]

  const reportText = `Astronomical Distance Conversion Report
------------------------------------------------------
Light-Years: ${val} ly

Converted Astronomical Units:
• Kilometers (km): ${fmtExp(km)} km
• Miles (mi): ${fmtExp(miles)} miles
• Astronomical Units (AU): ${au.toLocaleString('en-US', { maximumFractionDigits: 1 })} AU
• Parsecs (pc): ${parsecs.toFixed(4)} pc`

  return (
    <div className="tool-body">
      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        {presets.map((p) => (
          <button key={p.name} type="button" className="btn ghost" onClick={() => setLy(p.ly)}>
            {p.name} ({p.ly.toLocaleString()} ly)
          </button>
        ))}
      </div>

      <div className="row">
        <Field label="Distance in Light-Years (ly)">
          <input type="number" min="0" step="0.001" value={ly} onChange={(e) => setLy(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Kilometers: <strong>{fmtExp(km)} km</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Miles: <strong>{fmtExp(miles)} mi</strong> | Astronomical Units: {au.toLocaleString('en-US', { maximumFractionDigits: 1 })} AU | Parsecs: {parsecs.toFixed(4)} pc
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Astronomical Unit</th>
              <th>Converted Distance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="best">
              <td><strong>Kilometers (km)</strong></td>
              <td>{fmtExp(km)} km</td>
            </tr>
            <tr>
              <td>Miles (mi)</td>
              <td>{fmtExp(miles)} miles</td>
            </tr>
            <tr>
              <td>Astronomical Units (AU - Earth to Sun dist)</td>
              <td>{au.toLocaleString('en-US', { maximumFractionDigits: 1 })} AU</td>
            </tr>
            <tr>
              <td>Parsecs (pc)</td>
              <td>{parsecs.toFixed(4)} pc</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Conversion Report" />
        <button type="button" className="btn ghost" onClick={() => download('light-year-conversion.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
