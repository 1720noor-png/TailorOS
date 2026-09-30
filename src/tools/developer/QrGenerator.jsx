import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
import QRCode from 'qrcode'

export default function QrGenerator() {
  const [text, setText] = useState('')
  const [qr, setQr] = useState('')
  const [err, setErr] = useState('')

  const generate = async () => {
    setErr('')
    if (!text.trim()) { setErr('Enter text or URL.') ; return }
    try {
      const dataUrl = await QRCode.toDataURL(text)
      setQr(dataUrl)
    } catch(e) { setErr('Failed to generate QR code.') }
  }

  return (
    <div>
      <Field label="Text / URL"><input value={text} onChange={e=>setText(e.target.value)} placeholder="https://example.com" /></Field>
      <div className="actions"><button className="btn" onClick={generate}>Generate QR</button></div>
      <Msg>{err}</Msg>
      {qr && <div className="out" role="status" style={{textAlign:'center'}}>
        <img src={qr} alt="QR Code" style={{maxWidth:'200px'}} />
        <CopyBtn text={qr} />
      </div>}
      <p className="hint">Creates a QR code for any text or URL.</p>
    </div>
  )
}
