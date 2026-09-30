import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

const CONVERSIONS = {
  length: {
    name: 'Length',
    base: 'm',
    units: {
      m: { name: 'Meters (m)', factor: 1 },
      km: { name: 'Kilometers (km)', factor: 1000 },
      cm: { name: 'Centimeters (cm)', factor: 0.01 },
      mm: { name: 'Millimeters (mm)', factor: 0.001 },
      mi: { name: 'Miles (mi)', factor: 1609.344 },
      yd: { name: 'Yards (yd)', factor: 0.9144 },
      ft: { name: 'Feet (ft)', factor: 0.3048 },
      in: { name: 'Inches (in)', factor: 0.0254 },
    },
  },
  mass: {
    name: 'Mass & Weight',
    base: 'kg',
    units: {
      kg: { name: 'Kilograms (kg)', factor: 1 },
      g: { name: 'Grams (g)', factor: 0.001 },
      mg: { name: 'Milligrams (mg)', factor: 0.000001 },
      lb: { name: 'Pounds (lb)', factor: 0.45359237 },
      oz: { name: 'Ounces (oz)', factor: 0.028349523125 },
      ton: { name: 'Metric Tons (t)', factor: 1000 },
    },
  },
  speed: {
    name: 'Speed',
    base: 'kmh',
    units: {
      kmh: { name: 'km/h', factor: 1 },
      mph: { name: 'Miles per hour (mph)', factor: 1.609344 },
      ms: { name: 'Meters per second (m/s)', factor: 3.6 },
      knot: { name: 'Knots (kts)', factor: 1.852 },
    },
  },
  area: {
    name: 'Area',
    base: 'sqm',
    units: {
      sqm: { name: 'Square Meters (m²)', factor: 1 },
      sqkm: { name: 'Square Kilometers (km²)', factor: 1000000 },
      sqft: { name: 'Square Feet (ft²)', factor: 0.09290304 },
      acre: { name: 'Acres', factor: 4046.8564224 },
      ha: { name: 'Hectares (ha)', factor: 10000 },
    },
  },
}

export default function UnitConverter() {
  const [catKey, setCatKey] = useState('length')
  const [fromUnit, setFromUnit] = useState('km')
  const [toUnit, setToUnit] = useState('mi')
  const [val, setVal] = useState('10')

  const category = CONVERSIONS[catKey] || CONVERSIONS.length
  const units = category.units

  const handleCategoryChange = (key) => {
    setCatKey(key)
    const uKeys = Object.keys(CONVERSIONS[key].units)
    setFromUnit(uKeys[0])
    setToUnit(uKeys[1] || uKeys[0])
  }

  const numVal = Number(val) || 0
  const fromFactor = units[fromUnit]?.factor || 1
  const toFactor = units[toUnit]?.factor || 1

  // Convert to base unit then to target unit
  const result = (numVal * fromFactor) / toFactor
  const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '')

  const swap = () => {
    const tmp = fromUnit
    setFromUnit(toUnit)
    setToUnit(tmp)
  }

  const reportText = `Unit Conversion Result
-----------------------------------------
Category: ${category.name}
Input Value: ${val} ${units[fromUnit]?.name}
Converted Output: ${resultStr} ${units[toUnit]?.name}`

  return (
    <div className="tool-body">
      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        {Object.keys(CONVERSIONS).map((key) => (
          <button
            key={key}
            type="button"
            className={`btn ${catKey === key ? '' : 'ghost'}`}
            onClick={() => handleCategoryChange(key)}
          >
            {CONVERSIONS[key].name}
          </button>
        ))}
      </div>

      <div className="row">
        <Field label="Input Value">
          <input type="number" value={val} onChange={(e) => setVal(e.target.value)} />
        </Field>
        <Field label="From Unit">
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            {Object.entries(units).map(([uKey, uObj]) => (
              <option key={uKey} value={uKey}>
                {uObj.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="To Unit">
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {Object.entries(units).map(([uKey, uObj]) => (
              <option key={uKey} value={uKey}>
                {uObj.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="actions" style={{ margin: '0.6rem 0 1rem' }}>
        <button type="button" className="btn ghost" onClick={swap}>
          🔄 Swap Units
        </button>
      </div>

      <div className="out">
        <div>Converted Result: <strong>{resultStr} {units[toUnit]?.name}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Formula: {val} {units[fromUnit]?.name} × ({fromFactor} / {toFactor}) = {resultStr} {units[toUnit]?.name}
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Result" />
        <button type="button" className="btn ghost" onClick={() => download('unit-conversion.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
