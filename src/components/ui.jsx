import { useState } from 'react'
export const Field = ({ label, children }) => <label className="field"><span>{label}</span>{children}</label>
export const Msg = ({ kind = 'error', children }) =>
  children ? <p role={kind === 'error' ? 'alert' : 'status'} className={'msg ' + kind}>{children}</p> : null
export function CopyBtn({ text, label = 'Copy' }) {
  const [s, setS] = useState('')
  const go = async () => {
    try { await navigator.clipboard.writeText(text); setS('Copied') } catch { setS('Copy failed') }
    setTimeout(() => setS(''), 1500)
  }
  return <button type="button" className="btn ghost" onClick={go} disabled={!text}>{s || label}</button>
}
export function download(name, text, type = 'text/plain') {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type }))
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}
