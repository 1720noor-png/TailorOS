import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function TireSizeComparison() {
  // Tire 1: e.g. 225/45R17
  const [w1, setW1] = useState(225)
  const [ar1, setAr1] = useState(45)
  const [r1, setR1] = useState(17)

  // Tire 2: e.g. 245/40R18
  const [w2, setW2] = useState(245)
  const [ar2, setAr2] = useState(40)
  const [r2, setR2] = useState(18)

  const calcTire = (w, ar, r) => {
    const widthMm = Number(w) || 200
    const ratio = (Number(ar) || 50) / 100
    const rimInches = Number(r) || 16

    const sidewallMm = widthMm * ratio
    const sidewallInches = sidewallMm / 25.4
    const totalDiamInches = rimInches + sidewallInches * 2
    const totalDiamMm = totalDiamInches * 25.4
    const circMm = Math.PI * totalDiamMm
    const revsPerMile = 1609344 / circMm

    return {
      widthMm,
      sidewallMm: Math.round(sidewallMm * 10) / 10,
      rimInches,
      totalDiamInches: Math.round(totalDiamInches * 100) / 100,
      totalDiamMm: Math.round(totalDiamMm * 10) / 10,
      circMm: Math.round(circMm),
      revsPerMile: Math.round(revsPerMile),
    }
  }

  const t1 = calcTire(w1, ar1, r1)
  const t2 = calcTire(w2, ar2, r2)

  const diamDiffInches = Math.round((t2.totalDiamInches - t1.totalDiamInches) * 100) / 100
  const speedoPct = ((t2.totalDiamInches / (t1.totalDiamInches || 1) - 1) * 100).toFixed(1)
  const speedoAt60 = (60 * (t2.totalDiamInches / (t1.totalDiamInches || 1))).toFixed(1)

  const reportText = `Tire Size Dimensional Comparison
------------------------------------------------
Tire 1: ${w1}/${ar1}R${r1}
• Width: ${t1.widthMm} mm
• Sidewall: ${t1.sidewallMm} mm
• Overall Diameter: ${t1.totalDiamInches} in (${t1.totalDiamMm} mm)
• Revolutions / Mile: ${t1.revsPerMile}

Tire 2: ${w2}/${ar2}R${r2}
• Width: ${t2.widthMm} mm
• Sidewall: ${t2.sidewallMm} mm
• Overall Diameter: ${t2.totalDiamInches} in (${t2.totalDiamMm} mm)
• Revolutions / Mile: ${t2.revsPerMile}

Dimensional Difference:
• Diameter Diff: ${diamDiffInches > 0 ? '+' : ''}${diamDiffInches} inches (${speedoPct}%)
• Speedometer Error: When speedometer reads 60 mph, actual speed is ${speedoAt60} mph`

  return (
    <div className="tool-body">
      <div className="row">
        <div>
          <h3>Tire 1 (Stock / Original)</h3>
          <div className="row">
            <Field label="Width (mm)">
              <input type="number" step="5" value={w1} onChange={(e) => setW1(e.target.value)} />
            </Field>
            <Field label="Aspect Ratio (%)">
              <input type="number" step="5" value={ar1} onChange={(e) => setAr1(e.target.value)} />
            </Field>
            <Field label="Rim Size (in)">
              <input type="number" value={r1} onChange={(e) => setR1(e.target.value)} />
            </Field>
          </div>
        </div>

        <div>
          <h3>Tire 2 (New / Target)</h3>
          <div className="row">
            <Field label="Width (mm)">
              <input type="number" step="5" value={w2} onChange={(e) => setW2(e.target.value)} />
            </Field>
            <Field label="Aspect Ratio (%)">
              <input type="number" step="5" value={ar2} onChange={(e) => setAr2(e.target.value)} />
            </Field>
            <Field label="Rim Size (in)">
              <input type="number" value={r2} onChange={(e) => setR2(e.target.value)} />
            </Field>
          </div>
        </div>
      </div>

      <div className="out" style={{ marginTop: '1rem' }}>
        <div>Diameter Difference: <strong>{diamDiffInches > 0 ? '+' : ''}{diamDiffInches} inches</strong> ({speedoPct}%)</div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Speedometer Accuracy: When speedo displays <strong>60 mph</strong>, vehicle is moving at <strong>{speedoAt60} mph</strong>
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Dimension Metric</th>
              <th>Tire 1 ({w1}/{ar1}R{r1})</th>
              <th>Tire 2 ({w2}/{ar2}R{r2})</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Section Width</td>
              <td>{t1.widthMm} mm</td>
              <td>{t2.widthMm} mm</td>
              <td>{t2.widthMm - t1.widthMm} mm</td>
            </tr>
            <tr>
              <td>Sidewall Height</td>
              <td>{t1.sidewallMm} mm</td>
              <td>{t2.sidewallMm} mm</td>
              <td>{(t2.sidewallMm - t1.sidewallMm).toFixed(1)} mm</td>
            </tr>
            <tr className="best">
              <td>Overall Diameter</td>
              <td>{t1.totalDiamInches} in</td>
              <td>{t2.totalDiamInches} in</td>
              <td>{diamDiffInches} in</td>
            </tr>
            <tr>
              <td>Revolutions Per Mile</td>
              <td>{t1.revsPerMile}</td>
              <td>{t2.revsPerMile}</td>
              <td>{t2.revsPerMile - t1.revsPerMile}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Comparison Report" />
        <button type="button" className="btn ghost" onClick={() => download('tire-comparison.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
