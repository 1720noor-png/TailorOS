import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const DIGIT = { Black: 0, Brown: 1, Red: 2, Orange: 3, Yellow: 4, Green: 5, Blue: 6, Violet: 7, Grey: 8, White: 9 }
const MULT = { Black: 1, Brown: 10, Red: 100, Orange: 1000, Yellow: 1e4, Green: 1e5, Blue: 1e6, Violet: 1e7, Gold: 0.1, Silver: 0.01 }
const TOL = { Brown: '±1%', Red: '±2%', Gold: '±5%', Silver: '±10%', None: '±20%' }
const COLORS = Object.keys(DIGIT)
const MULT_COLORS = Object.keys(MULT)
const TOL_COLORS = Object.keys(TOL)

function fmtOhms(v) {
  if (v >= 1e6) return (v / 1e6).toFixed(v % 1e6 === 0 ? 0 : 2) + ' MΩ'
  if (v >= 1e3) return (v / 1e3).toFixed(v % 1e3 === 0 ? 0 : 2) + ' kΩ'
  return v.toFixed(v % 1 === 0 ? 0 : 2) + ' Ω'
}

export default function ResistorColorCodeCalculator() {
  const [b1, setB1] = useState('Brown')
  const [b2, setB2] = useState('Black')
  const [b3, setB3] = useState('Red')
  const [tol, setTol] = useState('Gold')

  const value = (DIGIT[b1] * 10 + DIGIT[b2]) * MULT[b3]

  return (
    <div>
      <div className="row">
        <Field label="Band 1 (1st digit)"><select value={b1} onChange={(e) => setB1(e.target.value)}>{COLORS.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Band 2 (2nd digit)"><select value={b2} onChange={(e) => setB2(e.target.value)}>{COLORS.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Band 3 (multiplier)"><select value={b3} onChange={(e) => setB3(e.target.value)}>{MULT_COLORS.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Band 4 (tolerance)"><select value={tol} onChange={(e) => setTol(e.target.value)}>{TOL_COLORS.map((c) => <option key={c}>{c}</option>)}</select></Field>
      </div>
      <p className="out" role="status">Resistance: <strong>{fmtOhms(value)}</strong> ({TOL[tol]})</p>
      <Msg kind="status">4-band code: digit, digit, multiplier, tolerance — reading left to right from the band closest to an edge.</Msg>
    </div>
  )
}
