import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function SignificantFiguresCalculator() {
  const [numInput, setNumInput] = useState('0.0045020')
  const [targetSigFigs, setTargetSigFigs] = useState(3)

  const str = numInput.trim()

  // Calculate significant figures count
  function countSigFigs(s) {
    if (!s || isNaN(Number(s))) return 0
    let clean = s.replace(/^-/, '')
    if (clean.includes('.')) {
      clean = clean.replace(/^0+/, '') // leading zeroes before first non-zero digit
      if (clean.startsWith('.')) clean = clean.substring(1).replace(/^0+/, '')
      return clean.replace('.', '').length
    } else {
      clean = clean.replace(/^0+/, '')
      // trailing zeroes in integer without decimal are ambiguous, counted as non-sig by standard convention
      clean = clean.replace(/0+$/, '')
      return clean.length
    }
  }

  const sigFigCount = countSigFigs(str)
  const num = parseFloat(str)
  const isValid = !isNaN(num)

  // Format to target sig figs
  let roundedVal = ''
  if (isValid && targetSigFigs > 0) {
    roundedVal = num.toPrecision(targetSigFigs)
  }

  const reportText = `Significant Figures Assessment
----------------------------------------------
Input Number: ${str}
Significant Digits Count: ${sigFigCount}

Rounded to ${targetSigFigs} Sig Figs: ${roundedVal}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Input Number">
          <input type="text" value={numInput} onChange={(e) => setNumInput(e.target.value)} placeholder="e.g. 0.0045020" />
        </Field>
        <Field label="Round to Target Sig Figs">
          <input
            type="number"
            min="1"
            max="10"
            value={targetSigFigs}
            onChange={(e) => setTargetSigFigs(Number(e.target.value))}
          />
        </Field>
      </div>

      {!isValid ? (
        <div className="msg error">Please enter a valid numeric value.</div>
      ) : (
        <>
          <div className="out">
            <div>Significant Figures Count: <strong>{sigFigCount} sig figs</strong></div>
            <div className="hint" style={{ marginTop: '0.4rem' }}>
              Rounded to {targetSigFigs} Sig-Figs: <strong>{roundedVal}</strong>
            </div>
          </div>

          <div className="actions" style={{ marginTop: '1rem' }}>
            <CopyBtn text={reportText} label="Copy Sig-Fig Result" />
            <button type="button" className="btn ghost" onClick={() => download('sig-figs-report.txt', reportText)}>
              Download (.txt)
            </button>
          </div>
        </>
      )}
    </div>
  )
}
