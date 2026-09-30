import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function FrequencyConverter() {
  const [val, setVal] = useState(440)
  const [unit, setUnit] = useState('hz') // 'hz', 'khz', 'mhz', 'ghz'

  const num = Number(val) || 0

  let hz = 0
  if (unit === 'hz') hz = num
  else if (unit === 'khz') hz = num * 1000
  else if (unit === 'mhz') hz = num * 1000000
  else if (unit === 'ghz') hz = num * 1000000000

  const khz = hz / 1000
  const mhz = hz / 1000000
  const ghz = hz / 1000000000

  // Speed of sound in air ~ 343 m/s
  const wavelengthMeters = hz > 0 ? (343 / hz).toFixed(4) : 0
  const periodMs = hz > 0 ? ((1 / hz) * 1000).toFixed(4) : 0

  const fmt = (n) => (Number.isInteger(n) ? n.toLocaleString('en-US') : n.toFixed(4).replace(/\.?0+$/, ''))

  const reportText = `Frequency Conversion Report
-----------------------------------------
Input Frequency: ${val} ${unit.toUpperCase()}

Equivalent Values:
• Hertz (Hz): ${fmt(hz)} Hz
• Kilohertz (kHz): ${fmt(khz)} kHz
• Megahertz (MHz): ${fmt(mhz)} MHz
• Gigahertz (GHz): ${fmt(ghz)} GHz

Acoustic Wave Characteristics (in Air @ 20°C):
• Wavelength (λ): ${wavelengthMeters} meters
• Time Period (T): ${periodMs} milliseconds`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Input Frequency Value">
          <input type="number" min="0" value={val} onChange={(e) => setVal(e.target.value)} />
        </Field>
        <Field label="Input Unit">
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="hz">Hertz (Hz)</option>
            <option value="khz">Kilohertz (kHz)</option>
            <option value="mhz">Megahertz (MHz)</option>
            <option value="ghz">Gigahertz (GHz)</option>
          </select>
        </Field>
      </div>

      <div className="out">
        <div>Hertz: <strong>{fmt(hz)} Hz</strong> | Kilohertz: <strong>{fmt(khz)} kHz</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Megahertz: {fmt(mhz)} MHz | Gigahertz: {fmt(ghz)} GHz
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Wave Property</th>
              <th>Calculated Value</th>
              <th>Description / Formula</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Wavelength (λ)</strong></td>
              <td>{wavelengthMeters} m</td>
              <td>λ = speed of sound (343 m/s) / frequency</td>
            </tr>
            <tr>
              <td><strong>Period Time (T)</strong></td>
              <td>{periodMs} ms</td>
              <td>T = 1 / frequency (duration of 1 cycle)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Frequency Report" />
        <button type="button" className="btn ghost" onClick={() => download('frequency-conversion.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
