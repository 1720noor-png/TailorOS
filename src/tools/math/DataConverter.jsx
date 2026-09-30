import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function DataConverter() {
  const [sizeVal, setSizeVal] = useState(50)
  const [sizeUnit, setSizeUnit] = useState('GB')
  const [speedMbps, setSpeedMbps] = useState(100)

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const v = Number(sizeVal) || 0
  const idx = units.indexOf(sizeUnit)

  // Decimal (1000) vs Binary (1024)
  const bytesDecimal = v * Math.pow(1000, idx)
  const bytesBinary = v * Math.pow(1024, idx)

  // Download time calculation based on Mbps
  const megabits = (bytesDecimal * 8) / 1000000
  const speed = Number(speedMbps) || 1
  const seconds = speed > 0 ? megabits / speed : 0

  const formatSecs = (s) => {
    if (!s || s === Infinity) return '0s'
    const hrs = Math.floor(s / 3600)
    const mins = Math.floor((s % 3600) / 60)
    const secs = Math.floor(s % 60)
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`
    if (mins > 0) return `${mins}m ${secs}s`
    return `${secs}s`
  }

  const fmtNum = (n) => (n >= 1 ? n.toLocaleString('en-US') : n.toFixed(6))

  const tableData = units.map((u, i) => {
    const decVal = bytesDecimal / Math.pow(1000, i)
    const binVal = bytesBinary / Math.pow(1024, i)
    return { unit: u, dec: fmtNum(decVal), bin: fmtNum(binVal) }
  })

  const reportText = `Data Storage & Download Speed Report
------------------------------------------------
File Size: ${sizeVal} ${sizeUnit}
Internet Speed: ${speedMbps} Mbps

Exact Bytes: ${bytesDecimal.toLocaleString('en-US')} Bytes

Estimated Download Time:
• At ${speedMbps} Mbps: ${formatSecs(seconds)}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="File / Storage Size">
          <input type="number" min="0" value={sizeVal} onChange={(e) => setSizeVal(e.target.value)} />
        </Field>
        <Field label="Unit">
          <select value={sizeUnit} onChange={(e) => setSizeUnit(e.target.value)}>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Connection Speed (Mbps)">
          <input type="number" min="1" value={speedMbps} onChange={(e) => setSpeedMbps(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Est. Download Time: <strong>{formatSecs(seconds)}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Total Raw Bytes: <strong>{bytesDecimal.toLocaleString('en-US')} B</strong>
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Decimal Standard (1 KB = 1000 B)</th>
              <th>Binary / RAM Standard (1 KiB = 1024 B)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.unit} className={row.unit === sizeUnit ? 'best' : ''}>
                <td><strong>{row.unit}</strong></td>
                <td>{row.dec} {row.unit}</td>
                <td>{row.bin} {row.unit === 'B' ? 'B' : row.unit.replace('B', 'iB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <CopyBtn text={reportText} label="Copy Conversion Summary" />
        <button type="button" className="btn ghost" onClick={() => download('data-conversion-report.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
