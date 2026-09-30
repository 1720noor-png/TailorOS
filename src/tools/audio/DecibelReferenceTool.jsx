import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

export default function DecibelReferenceTool() {
  const [selectedDb, setSelectedDb] = useState(60)

  const dbScale = [
    { db: 0, level: 'Threshold of Human Hearing', example: 'Barely audible sound in total silence', risk: 'Safe' },
    { db: 20, level: 'Whisper / Rustling Leaves', example: 'Quiet library, leaves rustling in breeze', risk: 'Safe' },
    { db: 40, level: 'Quiet Living Room', example: 'Suburban home environment, quiet conversation', risk: 'Safe' },
    { db: 60, level: 'Normal Conversational Speech', example: 'Background music, office chatter, dishwasher', risk: 'Safe' },
    { db: 80, level: 'Loud Traffic / Vacuum Cleaner', example: 'Heavy city traffic, garbage disposal, alarm clock', risk: 'Moderate (Prolonged exposure >8h)' },
    { db: 100, level: 'Power Tools / Motorcycle', example: 'Lawn mower, hair dryer near ear, subway train', risk: 'High (Risk of damage >15 mins)' },
    { db: 120, level: 'Live Rock Concert / Thunderclap', example: 'Siren at close range, jet takeoff (at 100m)', risk: 'Dangerous (Immediate hearing loss risk)' },
    { db: 140, level: 'Jet Engine at Takeoff / Gunshot', example: 'Threshold of physical ear pain', risk: 'Critical Pain / Damage' },
  ]

  const current = dbScale.find((d) => d.db >= selectedDb) || dbScale[3]

  return (
    <div className="tool-body">
      <div className="row">
        <Field label={`Selected Sound Level (${selectedDb} dB SPL)`}>
          <input
            type="range"
            min="0"
            max="140"
            step="10"
            value={selectedDb}
            onChange={(e) => setSelectedDb(Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="out" style={{ marginTop: '1rem' }}>
        <div>Sound Intensity Level: <strong>{current.db} dB SPL</strong> — <span>{current.level}</span></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          🔊 <strong>Example Sound Source:</strong> {current.example}
        </div>
        <div
          style={{
            marginTop: '0.4rem',
            color: current.db >= 100 ? 'var(--bad)' : current.db >= 80 ? '#d97706' : 'var(--ok)',
            fontWeight: 600,
          }}
        >
          🛡️ Hearing Health Risk: {current.risk}
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1.2rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Decibels (dB)</th>
              <th>Environment Level</th>
              <th>Real-World Example</th>
              <th>Safety Assessment</th>
            </tr>
          </thead>
          <tbody>
            {dbScale.map((row) => (
              <tr key={row.db} className={row.db === current.db ? 'best' : ''}>
                <td><strong>{row.db} dB</strong></td>
                <td>{row.level}</td>
                <td>{row.example}</td>
                <td style={{ color: row.db >= 100 ? 'var(--bad)' : row.db >= 80 ? '#d97706' : 'var(--ok)' }}>
                  {row.risk}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={`${current.db} dB (${current.level}) - Example: ${current.example} - Risk: ${current.risk}`} label="Copy Selected dB Info" />
      </div>
    </div>
  )
}
