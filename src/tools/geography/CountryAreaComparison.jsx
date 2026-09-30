import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function CountryAreaComparison() {
  const [c1Name, setC1Name] = useState('Canada')
  const [c2Name, setC2Name] = useState('Australia')

  const countries = [
    { name: 'Russia', areaSqKm: 17098242 },
    { name: 'Canada', areaSqKm: 9984670 },
    { name: 'China', areaSqKm: 9596960 },
    { name: 'United States', areaSqKm: 9525067 },
    { name: 'Brazil', areaSqKm: 8515767 },
    { name: 'Australia', areaSqKm: 7692024 },
    { name: 'India', areaSqKm: 3287263 },
    { name: 'Argentina', areaSqKm: 2780400 },
    { name: 'Kazakhstan', areaSqKm: 2724900 },
    { name: 'Algeria', areaSqKm: 2381741 },
    { name: 'United Kingdom', areaSqKm: 242495 },
    { name: 'Japan', areaSqKm: 377975 },
    { name: 'Germany', areaSqKm: 357022 },
  ]

  const c1 = countries.find((c) => c.name === c1Name) || countries[1]
  const c2 = countries.find((c) => c.name === c2Name) || countries[5]

  const ratio = (c1.areaSqKm / c2.areaSqKm).toFixed(2)
  const areaDiffSqKm = Math.abs(c1.areaSqKm - c2.areaSqKm)

  const fmtSqKm = (n) => n.toLocaleString('en-US') + ' km²'
  const fmtSqMi = (n) => Math.round(n * 0.386102).toLocaleString('en-US') + ' sq mi'

  const reportText = `Country Land Area Comparison
-----------------------------------------------
Country 1: ${c1.name} — ${fmtSqKm(c1.areaSqKm)} (${fmtSqMi(c1.areaSqKm)})
Country 2: ${c2.name} — ${fmtSqKm(c2.areaSqKm)} (${fmtSqMi(c2.areaSqKm)})

Comparison Results:
• ${c1.name} is ${ratio}x the size of ${c2.name}
• Area Difference: ${fmtSqKm(areaDiffSqKm)} (${fmtSqMi(areaDiffSqKm)})`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="First Country">
          <select value={c1Name} onChange={(e) => setC1Name(e.target.value)}>
            {countries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({fmtSqKm(c.areaSqKm)})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Second Country">
          <select value={c2Name} onChange={(e) => setC2Name(e.target.value)}>
            {countries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({fmtSqKm(c.areaSqKm)})
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="out">
        <div><strong>{c1.name}</strong> is <strong>{ratio}x</strong> the size of <strong>{c2.name}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Area Difference: <strong>{fmtSqKm(areaDiffSqKm)}</strong> ({fmtSqMi(areaDiffSqKm)})
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Country</th>
              <th>Total Land Area (km²)</th>
              <th>Total Land Area (sq miles)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>{c1.name}</strong></td>
              <td>{fmtSqKm(c1.areaSqKm)}</td>
              <td>{fmtSqMi(c1.areaSqKm)}</td>
            </tr>
            <tr>
              <td><strong>{c2.name}</strong></td>
              <td>{fmtSqKm(c2.areaSqKm)}</td>
              <td>{fmtSqMi(c2.areaSqKm)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Comparison Report" />
        <button type="button" className="btn ghost" onClick={() => download('country-area-comparison.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
