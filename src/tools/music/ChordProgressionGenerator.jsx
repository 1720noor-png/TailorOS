import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function ChordProgressionGenerator() {
  const [rootKey, setRootKey] = useState('C')
  const [style, setStyle] = useState('pop') // 'pop', 'jazz', 'rock', 'rnb'

  const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F']

  const progressionsByStyle = {
    pop: [
      { name: 'Pop Anthem (I - V - vi - IV)', roman: ['I', 'V', 'vi', 'IV'] },
      { name: 'Emotional Pop (vi - IV - I - V)', roman: ['vi', 'IV', 'I', 'V'] },
      { name: '50s Doo-Wop (I - vi - IV - V)', roman: ['I', 'vi', 'IV', 'V'] },
    ],
    rock: [
      { name: 'Classic Rock (I - bVII - IV)', roman: ['I', 'bVII', 'IV', 'I'] },
      { name: 'Alternative (i - VI - III - VII)', roman: ['i', 'VI', 'III', 'VII'] },
      { name: 'Blues Rock (I - IV - I - V)', roman: ['I', 'IV', 'I', 'V'] },
    ],
    jazz: [
      { name: 'Jazz ii - V - I Turnaround', roman: ['ii7', 'V7', 'Imaj7', 'VI7'] },
      { name: 'Minor Jazz ii-V-i', roman: ['ii7b5', 'V7b9', 'im7', 'im7'] },
    ],
    rnb: [
      { name: 'Neosoul Smooth (IVmaj7 - iii7 - vi7)', roman: ['IVmaj7', 'iii7', 'vi7', 'ii7'] },
      { name: 'R&B Ballad (I - iii - IV - V)', roman: ['I', 'iii', 'IV', 'V'] },
    ],
  }

  // Simple chord mapper for C major scale
  const chordMapC = {
    I: 'C',
    i: 'Cm',
    ii: 'Dm',
    ii7: 'Dm7',
    ii7b5: 'Dm7b5',
    iii: 'Em',
    iii7: 'Em7',
    IV: 'F',
    IVmaj7: 'Fmaj7',
    V: 'G',
    V7: 'G7',
    V7b9: 'G7(b9)',
    vi: 'Am',
    vi7: 'Am7',
    VI: 'A',
    VI7: 'A7',
    bVII: 'Bb',
    VII: 'Bdim',
    III: 'E',
    im7: 'Cm7',
    Imaj7: 'Cmaj7',
  }

  const selectedList = progressionsByStyle[style] || progressionsByStyle.pop

  const reportText = `Chord Progression Generator (${rootKey} ${style.toUpperCase()})
-------------------------------------------------------
Key: ${rootKey}
Genre Style: ${style}

Generated Progressions:
${selectedList
  .map(
    (p) =>
      `• ${p.name}\n  Roman Numerals: ${p.roman.join(' - ')}\n  Chords (in C): ${p.roman
        .map((r) => chordMapC[r] || r)
        .join(' - ')}`
  )
  .join('\n\n')}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Root Key Signature">
          <select value={rootKey} onChange={(e) => setRootKey(e.target.value)}>
            {keys.map((k) => (
              <option key={k} value={k}>
                {k} Major
              </option>
            ))}
          </select>
        </Field>

        <Field label="Musical Genre / Style">
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="pop">Pop / Commercial</option>
            <option value="rock">Rock / Alternative</option>
            <option value="jazz">Jazz / Fusion</option>
            <option value="rnb">R&B / Neo-Soul</option>
          </select>
        </Field>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Progression Pattern</th>
              <th>Roman Numerals</th>
              <th>Chords (in C Major)</th>
            </tr>
          </thead>
          <tbody>
            {selectedList.map((p) => (
              <tr key={p.name}>
                <td><strong>{p.name}</strong></td>
                <td><code>{p.roman.join(' - ')}</code></td>
                <td className="good">
                  <strong>{p.roman.map((r) => chordMapC[r] || r).join(' — ')}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Progression Chart" />
        <button type="button" className="btn ghost" onClick={() => download('chord-progressions.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
