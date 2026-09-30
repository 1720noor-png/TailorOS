import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import DocOut from '../../components/DocOut.jsx'
import { today } from '../../components/hooks.js'
const init = () => ({ sName: '', sAddr: '', sTitle: '', rName: '', rTitle: '', rCo: '', rAddr: '', date: today(), subject: '', body: '', close: 'Sincerely,' })
export default function BusinessLetter() {
  const [f, setF] = useState(init)
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const gen = () => {
    setOut('')
    if (!f.sName.trim()) return setErr('Enter your name.')
    if (!f.rName.trim() && !f.rCo.trim()) return setErr('Enter the recipient’s name or company.')
    if (!f.subject.trim()) return setErr('Enter a subject line.')
    if (f.body.trim().length < 10) return setErr('Write the body of the letter (at least a sentence).')
    if (!f.date) return setErr('Choose a date.')
    const d = new Date(f.date + 'T00:00:00').toLocaleDateString([], { dateStyle: 'long' })
    const p = (...a) => a.map((x) => x.trim()).filter(Boolean)
    setErr(''); setOut([...p(f.sName, f.sAddr), '', d, '', ...p(f.rName, f.rTitle, f.rCo, f.rAddr), '', `Dear ${f.rName.trim() || 'Sir or Madam'},`, '', `Subject: ${f.subject.trim()}`, '', f.body.trim(), '', f.close, '', '', ...p(f.sName, f.sTitle)].join('\n'))
  }
  return (
    <div>
      <h3>Sender</h3>
      <div className="row"><Field label="Your name *"><input value={f.sName} onChange={set('sName')} /></Field><Field label="Your job title / company"><input value={f.sTitle} onChange={set('sTitle')} /></Field></div>
      <Field label="Your address"><textarea rows="2" value={f.sAddr} onChange={set('sAddr')} /></Field>
      <h3>Recipient</h3>
      <div className="row"><Field label="Recipient name"><input value={f.rName} onChange={set('rName')} placeholder="Ms. Jane Smith" /></Field><Field label="Their title"><input value={f.rTitle} onChange={set('rTitle')} /></Field><Field label="Company"><input value={f.rCo} onChange={set('rCo')} /></Field></div>
      <Field label="Recipient address"><textarea rows="2" value={f.rAddr} onChange={set('rAddr')} /></Field>
      <h3>Letter</h3>
      <div className="row"><Field label="Date *"><input type="date" value={f.date} onChange={set('date')} /></Field><Field label="Subject *"><input value={f.subject} onChange={set('subject')} /></Field>
        <Field label="Closing"><select value={f.close} onChange={set('close')}>{['Sincerely,', 'Yours faithfully,', 'Best regards,', 'Kind regards,'].map((c) => <option key={c}>{c}</option>)}</select></Field></div>
      <Field label="Body *"><textarea rows="8" value={f.body} onChange={set('body')} /></Field>
      <div className="actions"><button className="btn" onClick={gen}>Generate letter</button><button className="btn ghost" onClick={() => { setF(init()); setOut(''); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <DocOut text={out} title="Business letter" filename="business-letter.txt" />}
    </div>
  )
}
