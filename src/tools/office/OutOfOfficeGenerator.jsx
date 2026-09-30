import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

export default function OutOfOfficeGenerator() {
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [reason, setReason] = useState('annual leave')
  const [contact, setContact] = useState('')
  const [tone, setTone] = useState('formal')
  const [urgent, setUrgent] = useState(true)

  const dateRange = from && to ? `${from} to ${to}` : from ? `from ${from}` : ''
  const build = () => {
    const contactLine = contact ? (tone === 'formal' ? `For urgent matters, please contact ${contact}.` : `Need something urgent? Reach out to ${contact}.`) : ''
    if (tone === 'formal') {
      return `Thank you for your email. I am currently out of the office${dateRange ? ` (${dateRange})` : ''} due to ${reason} and will have limited access to email.\n\n${urgent && contactLine ? contactLine + '\n\n' : ''}I will respond to your message as soon as possible upon my return.\n\nBest regards,\n${name || '[Your name]'}`
    }
    return `Hey — thanks for the email! I'm away${dateRange ? ` (${dateRange})` : ''} for ${reason}, so I'll be slow to reply.\n\n${urgent && contactLine ? contactLine + '\n\n' : ''}I'll get back to you as soon as I'm back!\n\n${name || '[Your name]'}`
  }
  const [out, setOut] = useState('')
  return (
    <div>
      <div className="row">
        <Field label="Your name"><input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Reason"><input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="annual leave, a conference, sick leave…" /></Field>
      </div>
      <div className="row">
        <Field label="Away from"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field label="Back on"><input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Backup contact (optional)"><input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="name and/or email" /></Field>
        <Field label="Tone"><select value={tone} onChange={(e) => setTone(e.target.value)}><option value="formal">Formal</option><option value="casual">Casual</option></select></Field>
      </div>
      <label className="check"><input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} /> Mention the backup contact for urgent matters</label>
      <div className="actions"><button className="btn" onClick={() => setOut(build())}>Generate message</button></div>
      {out && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{out}</pre>
        <CopyBtn text={out} label="Copy message" />
      </div>}
    </div>
  )
}
