import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function LatitudeLongitudeConverter() {
  const [mode, setMode] = useState('dd-to-dms') // 'dd-to-dms' or 'dms-to-dd'

  // DD Inputs
  const [latDd, setLatDd] = useState(40.7128)
  const [lngDd, setLngDd] = useState(-74.006)

  // DMS Inputs
  const [latD, setLatD] = useState(40)
  const [latM, setLatM] = useState(42)
  const [latS, setLatS] = useState(46.08)
  const [latDir, setLatDir] = useState('N')

  const [lngD, setLngD] = useState(74)
  const [lngM, setLngM] = useState(0)
  const [lngS, setLngS] = useState(21.6)
  const [lngDir, setLngDir] = useState('W')

  // Conversion logic: DD -> DMS
  const ddToDms = (dd, isLat) => {
    const dir = isLat ? (dd >= 0 ? 'N' : 'S') : dd >= 0 ? 'E' : 'W'
    const abs = Math.abs(dd)
    const deg = Math.floor(abs)
    const minFloat = (abs - deg) * 60
    const min = Math.floor(minFloat)
    const sec = ((minFloat - min) * 60).toFixed(2)
    return `${deg}° ${min}' ${sec}" ${dir}`
  }

  // Conversion logic: DMS -> DD
  const dmsToDd = (d, m, s, dir) => {
    const deg = Number(d) || 0
    const min = Number(m) || 0
    const sec = Number(s) || 0
    let dd = deg + min / 60 + sec / 3600
    if (dir === 'S' || dir === 'W') dd = -dd
    return dd.toFixed(6)
  }

  const resultDmsLat = ddToDms(Number(latDd) || 0, true)
  const resultDmsLng = ddToDms(Number(lngDd) || 0, false)

  const resultDdLat = dmsToDd(latD, latM, latS, latDir)
  const resultDdLng = dmsToDd(lngD, lngM, lngS, lngDir)

  const reportText = `Latitude & Longitude Coordinate Conversion
-----------------------------------------------------------
Decimal Degrees (DD):
• Latitude: ${mode === 'dd-to-dms' ? latDd : resultDdLat}°
• Longitude: ${mode === 'dd-to-dms' ? lngDd : resultDdLng}°

Degrees Minutes Seconds (DMS):
• Latitude: ${mode === 'dd-to-dms' ? resultDmsLat : `${latD}° ${latM}' ${latS}" ${latDir}`}
• Longitude: ${mode === 'dd-to-dms' ? resultDmsLng : `${lngD}° ${lngM}' ${lngS}" ${lngDir}`}`

  return (
    <div className="tool-body">
      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        <button
          type="button"
          className={`btn ${mode === 'dd-to-dms' ? '' : 'ghost'}`}
          onClick={() => setMode('dd-to-dms')}
        >
          Decimal Degrees → DMS
        </button>
        <button
          type="button"
          className={`btn ${mode === 'dms-to-dd' ? '' : 'ghost'}`}
          onClick={() => setMode('dms-to-dd')}
        >
          DMS → Decimal Degrees
        </button>
      </div>

      {mode === 'dd-to-dms' ? (
        <div className="row">
          <Field label="Latitude Decimal Degrees (DD)">
            <input type="number" step="0.000001" min="-90" max="90" value={latDd} onChange={(e) => setLatDd(e.target.value)} />
          </Field>
          <Field label="Longitude Decimal Degrees (DD)">
            <input type="number" step="0.000001" min="-180" max="180" value={lngDd} onChange={(e) => setLngDd(e.target.value)} />
          </Field>
        </div>
      ) : (
        <div className="row">
          <div>
            <h4>Latitude (DMS)</h4>
            <div className="row">
              <Field label="Deg (°)">
                <input type="number" value={latD} onChange={(e) => setLatD(e.target.value)} />
              </Field>
              <Field label="Min (')">
                <input type="number" value={latM} onChange={(e) => setLatM(e.target.value)} />
              </Field>
              <Field label="Sec (&quot;)">
                <input type="number" step="0.01" value={latS} onChange={(e) => setLatS(e.target.value)} />
              </Field>
              <Field label="Direction">
                <select value={latDir} onChange={(e) => setLatDir(e.target.value)}>
                  <option value="N">North (N)</option>
                  <option value="S">South (S)</option>
                </select>
              </Field>
            </div>
          </div>

          <div>
            <h4>Longitude (DMS)</h4>
            <div className="row">
              <Field label="Deg (°)">
                <input type="number" value={lngD} onChange={(e) => setLngD(e.target.value)} />
              </Field>
              <Field label="Min (')">
                <input type="number" value={lngM} onChange={(e) => setLngM(e.target.value)} />
              </Field>
              <Field label="Sec (&quot;)">
                <input type="number" step="0.01" value={lngS} onChange={(e) => setLngS(e.target.value)} />
              </Field>
              <Field label="Direction">
                <select value={lngDir} onChange={(e) => setLngDir(e.target.value)}>
                  <option value="E">East (E)</option>
                  <option value="W">West (W)</option>
                </select>
              </Field>
            </div>
          </div>
        </div>
      )}

      <div className="out" style={{ marginTop: '1rem' }}>
        {mode === 'dd-to-dms' ? (
          <>
            <div>DMS Latitude: <strong>{resultDmsLat}</strong></div>
            <div className="hint" style={{ marginTop: '0.4rem' }}>
              DMS Longitude: <strong>{resultDmsLng}</strong>
            </div>
          </>
        ) : (
          <>
            <div>DD Latitude: <strong>{resultDdLat}°</strong></div>
            <div className="hint" style={{ marginTop: '0.4rem' }}>
              DD Longitude: <strong>{resultDdLng}°</strong>
            </div>
          </>
        )}
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Coordinates" />
        <button type="button" className="btn ghost" onClick={() => download('coordinates-converted.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
