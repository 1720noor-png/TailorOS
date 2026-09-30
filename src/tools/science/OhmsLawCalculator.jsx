import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function OhmsLawCalculator() {
  const [target, setTarget] = useState('voltage') // 'voltage', 'current', 'resistance', 'power'
  const [val1, setVal1] = useState(12) // V or I or R
  const [val2, setVal2] = useState(2) // I or R or P

  const v1 = Number(val1) || 0
  const v2 = Number(val2) || 0

  let voltage = 0
  let current = 0
  let resistance = 0
  let power = 0

  if (target === 'voltage') {
    // Inputs: Current (I) and Resistance (R)
    current = v1
    resistance = v2
    voltage = current * resistance
    power = voltage * current
  } else if (target === 'current') {
    // Inputs: Voltage (V) and Resistance (R)
    voltage = v1
    resistance = v2
    current = resistance > 0 ? voltage / resistance : 0
    power = voltage * current
  } else if (target === 'resistance') {
    // Inputs: Voltage (V) and Current (I)
    voltage = v1
    current = v2
    resistance = current > 0 ? voltage / current : 0
    power = voltage * current
  } else if (target === 'power') {
    // Inputs: Voltage (V) and Current (I)
    voltage = v1
    current = v2
    resistance = current > 0 ? voltage / current : 0
    power = voltage * current
  }

  const fmt = (n) => (Number.isInteger(n) ? n.toString() : n.toFixed(4).replace(/\.?0+$/, ''))

  const reportText = `Ohm's Law Calculation Result
-----------------------------------------
Target Parameter: ${target.toUpperCase()}

Calculated Electrical Values:
• Voltage (V): ${fmt(voltage)} Volts
• Current (I): ${fmt(current)} Amperes (Amps)
• Resistance (R): ${fmt(resistance)} Ohms (Ω)
• Power (P): ${fmt(power)} Watts (W)`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Calculate Parameter">
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="voltage">Voltage (V = I × R)</option>
            <option value="current">Current (I = V / R)</option>
            <option value="resistance">Resistance (R = V / I)</option>
            <option value="power">Power (P = V × I)</option>
          </select>
        </Field>

        {target === 'voltage' && (
          <>
            <Field label="Current (I in Amperes)">
              <input type="number" step="0.1" value={val1} onChange={(e) => setVal1(e.target.value)} />
            </Field>
            <Field label="Resistance (R in Ohms)">
              <input type="number" step="0.1" value={val2} onChange={(e) => setVal2(e.target.value)} />
            </Field>
          </>
        )}

        {target === 'current' && (
          <>
            <Field label="Voltage (V in Volts)">
              <input type="number" step="0.1" value={val1} onChange={(e) => setVal1(e.target.value)} />
            </Field>
            <Field label="Resistance (R in Ohms)">
              <input type="number" step="0.1" value={val2} onChange={(e) => setVal2(e.target.value)} />
            </Field>
          </>
        )}

        {(target === 'resistance' || target === 'power') && (
          <>
            <Field label="Voltage (V in Volts)">
              <input type="number" step="0.1" value={val1} onChange={(e) => setVal1(e.target.value)} />
            </Field>
            <Field label="Current (I in Amperes)">
              <input type="number" step="0.1" value={val2} onChange={(e) => setVal2(e.target.value)} />
            </Field>
          </>
        )}
      </div>

      <div className="out">
        <div>
          {target === 'voltage' && <>Voltage (V): <strong>{fmt(voltage)} Volts</strong></>}
          {target === 'current' && <>Current (I): <strong>{fmt(current)} Amps</strong></>}
          {target === 'resistance' && <>Resistance (R): <strong>{fmt(resistance)} Ω</strong></>}
          {target === 'power' && <>Power (P): <strong>{fmt(power)} Watts</strong></>}
        </div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Voltage: {fmt(voltage)} V | Current: {fmt(current)} A | Resistance: {fmt(resistance)} Ω | Power: {fmt(power)} W
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Calculation Report" />
        <button type="button" className="btn ghost" onClick={() => download('ohms-law-report.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
