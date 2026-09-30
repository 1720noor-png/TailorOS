import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function BpmConverter() {
  const [bpm, setBpm] = useState(120)

  const b = Number(bpm) || 1

  // Beat Intervals in milliseconds
  const quarterMs = Math.round((60000 / b) * 10) / 10
  const eighthMs = Math.round((quarterMs / 2) * 10) / 10
  const sixteenthMs = Math.round((quarterMs / 4) * 10) / 10
  const halfMs = Math.round((quarterMs * 2) * 10) / 10
  const wholeMs = Math.round((quarterMs * 4) * 10) / 10

  // Dotted and Triplet values
  const dottedQuarterMs = Math.round((quarterMs * 1.5) * 10) / 10
  const tripletQuarterMs = Math.round(((quarterMs * 2) / 3) * 10) / 10

  // Frequency in Hz
  const beatsPerSecHz = (b / 60).toFixed(3)

  const reportText = `Tempo & BPM Delay Time Matrix
-----------------------------------------------
Beats Per Minute: ${b} BPM (${beatsPerSecHz} Hz)

Beat Lengths (Delay / LFO Sync):
• Whole Note (1/1): ${wholeMs} ms
• Half Note (1/2): ${halfMs} ms
• Quarter Note (1/4): ${quarterMs} ms
• 8th Note (1/8): ${eighthMs} ms
• 16th Note (1/16): ${sixteenthMs} ms

Special Note Lengths:
• Dotted Quarter (1/4d): ${dottedQuarterMs} ms
• Triplet Quarter (1/4t): ${tripletQuarterMs} ms`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Tempo (Beats Per Minute)">
          <input type="number" min="20" max="300" value={bpm} onChange={(e) => setBpm(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Quarter Note Beat (1/4): <strong>{quarterMs} ms</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Frequency: <strong>{beatsPerSecHz} Hz</strong> | 8th Note: {eighthMs} ms | 16th Note: {sixteenthMs} ms
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Note Subdivision</th>
              <th>Millisecond (ms) Sync</th>
              <th>LFO Frequency (Hz)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Whole Note (1/1)</td>
              <td>{wholeMs} ms</td>
              <td>{(1000 / wholeMs).toFixed(2)} Hz</td>
            </tr>
            <tr>
              <td>Half Note (1/2)</td>
              <td>{halfMs} ms</td>
              <td>{(1000 / halfMs).toFixed(2)} Hz</td>
            </tr>
            <tr className="best">
              <td><strong>Quarter Note (1/4 - Beat)</strong></td>
              <td><strong>{quarterMs} ms</strong></td>
              <td><strong>{beatsPerSecHz} Hz</strong></td>
            </tr>
            <tr>
              <td>8th Note (1/8)</td>
              <td>{eighthMs} ms</td>
              <td>{(1000 / eighthMs).toFixed(2)} Hz</td>
            </tr>
            <tr>
              <td>16th Note (1/16)</td>
              <td>{sixteenthMs} ms</td>
              <td>{(1000 / sixteenthMs).toFixed(2)} Hz</td>
            </tr>
            <tr>
              <td>Dotted Quarter (1/4d)</td>
              <td>{dottedQuarterMs} ms</td>
              <td>{(1000 / dottedQuarterMs).toFixed(2)} Hz</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Delay Matrix" />
        <button type="button" className="btn ghost" onClick={() => download('bpm-delay-matrix.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
