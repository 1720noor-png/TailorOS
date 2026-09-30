import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function GeometryCalculator() {
  const [shape, setShape] = useState('circle')
  const [valA, setValA] = useState(10) // radius, length, etc
  const [valB, setValB] = useState(5) // width, height, etc
  const [valC, setValC] = useState(8) // height depth

  const a = Number(valA) || 0
  const b = Number(valB) || 0
  const c = Number(valC) || 0

  let area = 0
  let perimeter = 0
  let volume = 0
  let surfaceArea = 0
  let formulaStr = ''

  if (shape === 'circle') {
    area = Math.PI * a * a
    perimeter = 2 * Math.PI * a
    formulaStr = 'Area = π × r², Circumference = 2 × π × r'
  } else if (shape === 'rectangle') {
    area = a * b
    perimeter = 2 * (a + b)
    formulaStr = 'Area = length × width, Perimeter = 2 × (length + width)'
  } else if (shape === 'triangle') {
    area = 0.5 * a * b
    perimeter = a + b + Math.sqrt(a * a + b * b) // right triangle approx
    formulaStr = 'Area = 0.5 × base × height'
  } else if (shape === 'sphere') {
    volume = (4 / 3) * Math.PI * Math.pow(a, 3)
    surfaceArea = 4 * Math.PI * a * a
    formulaStr = 'Volume = (4/3) × π × r³, Surface Area = 4 × π × r²'
  } else if (shape === 'cylinder') {
    volume = Math.PI * a * a * b
    surfaceArea = 2 * Math.PI * a * b + 2 * Math.PI * a * a
    formulaStr = 'Volume = π × r² × h, Surface Area = 2πrh + 2πr²'
  } else if (shape === 'prism') {
    volume = a * b * c
    surfaceArea = 2 * (a * b + b * c + a * c)
    formulaStr = 'Volume = l × w × h, Surface Area = 2(lw + wh + lh)'
  }

  const fmt = (num) => (Number.isInteger(num) ? num.toString() : num.toFixed(4).replace(/\.?0+$/, ''))

  const is3D = ['sphere', 'cylinder', 'prism'].includes(shape)

  const reportText = `Geometry Calculation (${shape.toUpperCase()})
---------------------------------------------
Shape: ${shape}
Formula: ${formulaStr}

Results:
${is3D ? `• Volume: ${fmt(volume)}\n• Total Surface Area: ${fmt(surfaceArea)}` : `• Area: ${fmt(area)}\n• Perimeter / Circumference: ${fmt(perimeter)}`}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Select Geometric Shape">
          <select value={shape} onChange={(e) => setShape(e.target.value)}>
            <option value="circle">Circle (2D)</option>
            <option value="rectangle">Rectangle (2D)</option>
            <option value="triangle">Right Triangle (2D)</option>
            <option value="sphere">Sphere (3D)</option>
            <option value="cylinder">Cylinder (3D)</option>
            <option value="prism">Rectangular Prism (3D)</option>
          </select>
        </Field>

        {shape === 'circle' && (
          <Field label="Radius (r)">
            <input type="number" min="0" value={valA} onChange={(e) => setValA(e.target.value)} />
          </Field>
        )}

        {shape === 'rectangle' && (
          <>
            <Field label="Length (l)">
              <input type="number" min="0" value={valA} onChange={(e) => setValA(e.target.value)} />
            </Field>
            <Field label="Width (w)">
              <input type="number" min="0" value={valB} onChange={(e) => setValB(e.target.value)} />
            </Field>
          </>
        )}

        {shape === 'triangle' && (
          <>
            <Field label="Base (b)">
              <input type="number" min="0" value={valA} onChange={(e) => setValA(e.target.value)} />
            </Field>
            <Field label="Height (h)">
              <input type="number" min="0" value={valB} onChange={(e) => setValB(e.target.value)} />
            </Field>
          </>
        )}

        {shape === 'sphere' && (
          <Field label="Radius (r)">
            <input type="number" min="0" value={valA} onChange={(e) => setValA(e.target.value)} />
          </Field>
        )}

        {shape === 'cylinder' && (
          <>
            <Field label="Radius (r)">
              <input type="number" min="0" value={valA} onChange={(e) => setValA(e.target.value)} />
            </Field>
            <Field label="Height (h)">
              <input type="number" min="0" value={valB} onChange={(e) => setValB(e.target.value)} />
            </Field>
          </>
        )}

        {shape === 'prism' && (
          <>
            <Field label="Length (l)">
              <input type="number" min="0" value={valA} onChange={(e) => setValA(e.target.value)} />
            </Field>
            <Field label="Width (w)">
              <input type="number" min="0" value={valB} onChange={(e) => setValB(e.target.value)} />
            </Field>
            <Field label="Height (h)">
              <input type="number" min="0" value={valC} onChange={(e) => setValC(e.target.value)} />
            </Field>
          </>
        )}
      </div>

      <div className="out">
        {is3D ? (
          <>
            <div>Volume: <strong>{fmt(volume)} unit³</strong></div>
            <div className="hint" style={{ marginTop: '0.4rem' }}>
              Surface Area: <strong>{fmt(surfaceArea)} unit²</strong>
            </div>
          </>
        ) : (
          <>
            <div>Area: <strong>{fmt(area)} unit²</strong></div>
            <div className="hint" style={{ marginTop: '0.4rem' }}>
              Perimeter / Circumference: <strong>{fmt(perimeter)} units</strong>
            </div>
          </>
        )}
      </div>

      <div className="hint" style={{ marginTop: '0.8rem' }}>
        ℹ️ <strong>Formula:</strong> {formulaStr}
      </div>

      <div className="actions" style={{ marginTop: '1.2rem' }}>
        <CopyBtn text={reportText} label="Copy Geometry Result" />
        <button type="button" className="btn ghost" onClick={() => download('geometry-report.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
