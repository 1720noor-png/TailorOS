import { useState, useEffect } from 'react'

export default function TextToSpeech() {
  const [text, setText] = useState('Welcome to ToolHub! Select any tool to get started.')
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const avail = window.speechSynthesis.getVoices()
        setVoices(avail)
        if (avail.length > 0 && !selectedVoice) {
          setSelectedVoice(avail[0].name)
        }
      }
    }

    loadVoices()
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      setError('Text to Speech is not supported in this browser.')
      return
    }
    if (!text.trim()) {
      setError('Please enter text to read aloud.')
      return
    }

    setError('')
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = pitch

    if (selectedVoice) {
      const v = voices.find((v) => v.name === selectedVoice)
      if (v) utterance.voice = v
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = (e) => {
      console.error(e)
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="panel">
      <h2>Text to Speech</h2>
      <p className="hint">Convert written text into natural spoken audio directly in your browser.</p>

      <div className="field">
        <span>Enter Text to Read Aloud</span>
        <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text here..." />
      </div>

      <div className="row">
        <div className="field">
          <span>Voice</span>
          <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}>
            {voices.map((v, i) => (
              <option key={i} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </div>

        <div className="field">
          <span>Speed ({rate}x)</span>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} />
        </div>

        <div className="field">
          <span>Pitch ({pitch})</span>
          <input type="range" min={0.5} max={1.5} step={0.1} value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} />
        </div>
      </div>

      {error && <div className="msg error">{error}</div>}

      <div className="actions">
        {!isSpeaking ? (
          <button className="btn" onClick={speak}>🔊 Speak Text</button>
        ) : (
          <button className="btn ghost" onClick={stop}>🛑 Stop Speaking</button>
        )}
      </div>
    </div>
  )
}
