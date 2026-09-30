import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function AudioFileSizeEstimator() {
  const [mins, setMins] = useState(45)
  const [bitrateKbps, setBitrateKbps] = useState(320)
  const [channels, setChannels] = useState(2) // 1 = mono, 2 = stereo
  const [format, setFormat] = useState('mp3') // 'mp3', 'wav', 'flac', 'aac'

  const durationSecs = (Number(mins) || 0) * 60

  let sizeBytes = 0
  if (format === 'wav') {
    // Uncompressed 16-bit 44.1kHz PCM WAV
    sizeBytes = durationSecs * 44100 * 2 * channels
  } else if (format === 'flac') {
    // Lossless compression approx ~60% of WAV
    sizeBytes = durationSecs * 44100 * 2 * channels * 0.6
  } else {
    // Compressed (MP3/AAC): Bitrate in kbps -> Bytes = (kbps * 1000 / 8) * duration
    const kbps = Number(bitrateKbps) || 128
    sizeBytes = (kbps * 1000 / 8) * durationSecs
  }

  const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2)
  const sizeGB = (sizeBytes / (1024 * 1024 * 1024)).toFixed(3)

  const presets = [
    { name: 'MP3 High Quality (320 kbps)', fmt: 'mp3', kbps: 320, ch: 2 },
    { name: 'Podcast Speech (128 kbps Mono)', fmt: 'mp3', kbps: 128, ch: 1 },
    { name: 'CD-Quality Uncompressed WAV (16-bit 44.1k)', fmt: 'wav', kbps: 1411, ch: 2 },
    { name: 'FLAC Lossless Audio', fmt: 'flac', kbps: 850, ch: 2 },
  ]

  const reportText = `Audio File Size Estimation
-------------------------------------------
Duration: ${mins} minutes (${durationSecs} seconds)
Format: ${format.toUpperCase()}
Bitrate: ${format === 'wav' ? '1411 kbps (16-bit PCM)' : format === 'flac' ? '~850 kbps (Lossless)' : `${bitrateKbps} kbps`}
Channels: ${channels === 1 ? 'Mono (1 ch)' : 'Stereo (2 ch)'}

Estimated File Size:
• ${sizeMB} MB (${sizeGB} GB)
• ${Math.round(sizeBytes).toLocaleString()} Bytes`

  return (
    <div className="tool-body">
      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            className="btn ghost"
            onClick={() => {
              setFormat(p.fmt)
              setBitrateKbps(p.kbps)
              setChannels(p.ch)
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="row">
        <Field label="Audio Duration (Minutes)">
          <input type="number" min="1" max="1000" value={mins} onChange={(e) => setMins(e.target.value)} />
        </Field>

        <Field label="Audio Format">
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="mp3">MP3 (Compressed)</option>
            <option value="aac">AAC / M4A (Compressed)</option>
            <option value="wav">WAV (Uncompressed PCM)</option>
            <option value="flac">FLAC (Lossless Compressed)</option>
          </select>
        </Field>

        {['mp3', 'aac'].includes(format) && (
          <Field label="Audio Bitrate (kbps)">
            <select value={bitrateKbps} onChange={(e) => setBitrateKbps(e.target.value)}>
              <option value="64">64 kbps (Low quality speech)</option>
              <option value="128">128 kbps (Standard podcast)</option>
              <option value="192">192 kbps (Medium quality music)</option>
              <option value="256">256 kbps (High quality music)</option>
              <option value="320">320 kbps (Maximum MP3 quality)</option>
            </select>
          </Field>
        )}

        <Field label="Audio Channels">
          <select value={channels} onChange={(e) => setChannels(Number(e.target.value))}>
            <option value={1}>Mono (1 channel)</option>
            <option value={2}>Stereo (2 channels)</option>
          </select>
        </Field>
      </div>

      <div className="out">
        <div>Estimated Size: <strong>{sizeMB} MB</strong> ({sizeGB} GB)</div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Exact Bytes: {Math.round(sizeBytes).toLocaleString()} Bytes | Total Secs: {durationSecs}s
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1.2rem' }}>
        <CopyBtn text={reportText} label="Copy Size Estimate" />
        <button type="button" className="btn ghost" onClick={() => download('audio-size-estimate.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
