import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function AudioDurationCalculator() {
  const [tracks, setTracks] = useState([
    { id: 1, name: 'Intro Theme', mins: 1, secs: 30 },
    { id: 2, name: 'Main Podcast Topic', mins: 24, secs: 45 },
    { id: 3, name: 'Sponsor Break', mins: 2, secs: 10 },
    { id: 4, name: 'Outro & Credits', mins: 3, secs: 15 },
  ])

  const addTrack = () => {
    setTracks((prev) => [
      ...prev,
      { id: Date.now(), name: `Track ${prev.length + 1}`, mins: 0, secs: 0 },
    ])
  }

  const updateTrack = (id, field, val) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    )
  }

  const removeTrack = (id) => {
    setTracks((prev) => prev.filter((t) => t.id !== id))
  }

  const totalSecs = tracks.reduce((acc, t) => {
    const m = Number(t.mins) || 0
    const s = Number(t.secs) || 0
    return acc + m * 60 + s
  }, 0)

  const h = Math.floor(totalSecs / 3600)
  const m = Math.floor((totalSecs % 3600) / 60)
  const s = totalSecs % 60

  const fmtDuration = (sec) => {
    const tm = Math.floor(sec / 60)
    const ts = sec % 60
    return `${tm}:${ts < 10 ? '0' : ''}${ts}`
  }

  const reportText = `Audio Playlist Duration Summary
-----------------------------------------------
Total Tracks: ${tracks.length}
Total Duration: ${h > 0 ? `${h}h ` : ''}${m}m ${s}s (${totalSecs} seconds)

Tracklist Breakdown:
${tracks.map((t, idx) => `${idx + 1}. ${t.name}: ${t.mins}m ${t.secs}s`).join('\n')}`

  return (
    <div className="tool-body">
      <div className="out" style={{ marginBottom: '1.2rem' }}>
        <div>Total Audio Duration: <strong>{h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Tracks Count: {tracks.length} | Raw Duration: {totalSecs.toLocaleString()} seconds
        </div>
      </div>

      <div className="scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th>Track Title</th>
              <th>Minutes</th>
              <th>Seconds</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((t) => (
              <tr key={t.id}>
                <td>
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => updateTrack(t.id, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={t.mins}
                    onChange={(e) => updateTrack(t.id, 'mins', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={t.secs}
                    onChange={(e) => updateTrack(t.id, 'secs', e.target.value)}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn ghost"
                    style={{ color: 'var(--bad)', borderColor: 'var(--bad)' }}
                    onClick={() => removeTrack(t.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <button type="button" className="btn" onClick={addTrack}>
          ➕ Add Audio Track
        </button>
        <CopyBtn text={reportText} label="Copy Duration Summary" />
        <button type="button" className="btn ghost" onClick={() => download('audio-duration.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
