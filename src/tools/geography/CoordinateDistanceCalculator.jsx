import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function CoordinateDistanceCalculator() {
  // Location 1: New York City
  const [lat1, setLat1] = useState(40.7128)
  const [lng1, setLng1] = useState(-74.006)

  // Location 2: London Big Ben
  const [lat2, setLat2] = useState(51.5007)
  const [lng2, setLng2] = useState(-0.1246)

  // Haversine formula for geodesic distance
  const toRad = (deg) => (deg * Math.PI) / 180
  const R_km = 6371 // Earth radius in km

  const dLat = toRad((Number(lat2) || 0) - (Number(lat1) || 0))
  const dLng = toRad((Number(lng2) || 0) - (Number(lng1) || 0))

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(Number(lat1) || 0)) *
      Math.cos(toRad(Number(lat2) || 0)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distKm = R_km * c
  const distMiles = distKm * 0.621371
  const distNautical = distKm * 0.539957

  const fmt = (n) => Math.round(n).toLocaleString('en-US')

  const presets = [
    { name: 'NYC to London', l1: [40.7128, -74.006], l2: [51.5007, -0.1246] },
    { name: 'Tokyo to Sydney', l1: [35.6762, 139.6503], l2: [-33.8688, 151.2093] },
    { name: 'Paris to Cairo', l1: [48.8566, 2.3522], l2: [30.0444, 31.2357] },
  ]

  const reportText = `Geographic Coordinate Distance Calculation
-------------------------------------------------------
Point A: Lat ${lat1}°, Lng ${lng1}°
Point B: Lat ${lat2}°, Lng ${lng2}°

Great-Circle (Haversine) Distance:
• Kilometers: ${fmt(distKm)} km
• Miles: ${fmt(distMiles)} miles
• Nautical Miles: ${fmt(distNautical)} NM`

  return (
    <div className="tool-body">
      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            className="btn ghost"
            onClick={() => {
              setLat1(p.l1[0])
              setLng1(p.l1[1])
              setLat2(p.l2[0])
              setLng2(p.l2[1])
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="row">
        <div>
          <h4>Location Point A</h4>
          <div className="row">
            <Field label="Latitude (°)">
              <input type="number" step="0.0001" min="-90" max="90" value={lat1} onChange={(e) => setLat1(e.target.value)} />
            </Field>
            <Field label="Longitude (°)">
              <input type="number" step="0.0001" min="-180" max="180" value={lng1} onChange={(e) => setLng1(e.target.value)} />
            </Field>
          </div>
        </div>

        <div>
          <h4>Location Point B</h4>
          <div className="row">
            <Field label="Latitude (°)">
              <input type="number" step="0.0001" min="-90" max="90" value={lat2} onChange={(e) => setLat2(e.target.value)} />
            </Field>
            <Field label="Longitude (°)">
              <input type="number" step="0.0001" min="-180" max="180" value={lng2} onChange={(e) => setLng2(e.target.value)} />
            </Field>
          </div>
        </div>
      </div>

      <div className="out" style={{ marginTop: '1rem' }}>
        <div>Great-Circle Distance: <strong>{fmt(distKm)} km</strong> ({fmt(distMiles)} miles)</div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Nautical Distance: <strong>{fmt(distNautical)} NM</strong> | Calculation: Haversine Formula
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Distance Result" />
        <button type="button" className="btn ghost" onClick={() => download('coordinate-distance.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
