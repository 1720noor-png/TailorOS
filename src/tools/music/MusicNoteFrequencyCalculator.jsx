import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function MusicNoteFrequencyCalculator() {
  const [noteName, setNoteName] = useState('A')
  const [octave, setOctave] = useState(4)
  const [concertA, setConcertA] = useState(440) // A4 = 440 Hz standard

  const notes = ['C', 'C# / Db', 'D', 'D# / Eb', 'E', 'F', 'F# / Gb', 'G', 'G# / Ab', 'A', 'A# / Bb', 'B']

  const noteIdx = notes.findIndex((n) => n.startsWith(noteName))
  const oct = Number(octave) || 4
  const a4Hz = Number(concertA) || 440

  // Calculate semitones distance from A4 (which is octave 4, note index 9)
  const semitonesFromA4 = (oct - 4) * 12 + (noteIdx - 9)
  const calculatedHz = a4Hz * Math.pow(2, semitonesFromA4 / 12)

  const fmtHz = (hz) => hz.toFixed(2) + ' Hz'

  // Generate octave 4 table
  const octave4Table = notes.map((n, i) => {
    const semi = (4 - 4) * 12 + (i - 9)
    const freq = a4Hz * Math.pow(2, semi / 12)
    return { name: `${n.split(' ')[0]}4`, freq }
  })

  const reportText = `Musical Note Frequency Report
-----------------------------------------
Selected Note: ${noteName}${oct}
Concert Pitch Standard: A4 = ${concertA} Hz
Semitones relative to A4: ${semitonesFromA4}

Exact Frequency: ${calculatedHz.toFixed(3)} Hz`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Note Name">
          <select value={noteName} onChange={(e) => setNoteName(e.target.value)}>
            {notes.map((n) => {
              const nameOnly = n.split(' ')[0]
              return (
                <option key={nameOnly} value={nameOnly}>
                  {n}
                </option>
              )
            })}
          </select>
        </Field>

        <Field label="Octave Number (0 - 8)">
          <select value={octave} onChange={(e) => setOctave(Number(e.target.value))}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((o) => (
              <option key={o} value={o}>
                Octave {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Concert Pitch Tuning (A4 Hz)">
          <input type="number" min="415" max="466" value={concertA} onChange={(e) => setConcertA(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Frequency of {noteName}{oct}: <strong>{fmtHz(calculatedHz)}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Tuning Standard: A4 = {concertA} Hz | Distance from A4: {semitonesFromA4} semitones
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Note Name (Octave 4)</th>
              <th>Frequency (Hz)</th>
            </tr>
          </thead>
          <tbody>
            {octave4Table.map((item) => (
              <tr key={item.name} className={item.name.startsWith(noteName) ? 'best' : ''}>
                <td><strong>{item.name}</strong></td>
                <td>{fmtHz(item.freq)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Frequency Info" />
        <button type="button" className="btn ghost" onClick={() => download('note-frequency.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
