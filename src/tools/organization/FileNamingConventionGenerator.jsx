import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

const TODAY = () => {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

export default function FileNamingConventionGenerator() {
  const [project, setProject] = useState('project')
  const [desc, setDesc] = useState('draft')
  const [version, setVersion] = useState('v1')
  const [dateFormat, setDateFormat] = useState('YYYYMMDD')
  const [caseStyle, setCaseStyle] = useState('kebab-case')
  const [ext, setExt] = useState('pdf')

  const slug = (s) => s.trim().replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(' ').filter(Boolean)

  const build = () => {
    const parts = [...slug(project), ...slug(desc), ...slug(version)]
    const dateStr = dateFormat === 'YYYYMMDD' ? TODAY() : dateFormat === 'none' ? null : new Date().toISOString().slice(0, 10)
    let joined
    if (caseStyle === 'kebab-case') joined = parts.map((p) => p.toLowerCase()).join('-')
    else if (caseStyle === 'snake_case') joined = parts.map((p) => p.toLowerCase()).join('_')
    else if (caseStyle === 'camelCase') joined = parts.map((p, i) => i === 0 ? p.toLowerCase() : p[0].toUpperCase() + p.slice(1).toLowerCase()).join('')
    else joined = parts.map((p) => p[0].toUpperCase() + p.slice(1).toLowerCase()).join('')
    if (dateStr) joined += (caseStyle === 'kebab-case' ? '-' : caseStyle === 'snake_case' ? '_' : '') + dateStr
    return joined + (ext ? '.' + ext.replace(/^\./, '') : '')
  }

  const result = build()

  return (
    <div>
      <div className="row">
        <Field label="Project / client"><input value={project} onChange={(e) => setProject(e.target.value)} /></Field>
        <Field label="Description"><input value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
        <Field label="Version"><input value={version} onChange={(e) => setVersion(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Date"><select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}><option value="YYYYMMDD">YYYYMMDD (today)</option><option value="none">No date</option></select></Field>
        <Field label="Case style"><select value={caseStyle} onChange={(e) => setCaseStyle(e.target.value)}><option>kebab-case</option><option>snake_case</option><option>camelCase</option><option>PascalCase</option></select></Field>
        <Field label="Extension"><input value={ext} onChange={(e) => setExt(e.target.value)} /></Field>
      </div>
      <p className="out" role="status">Suggested filename: <strong>{result}</strong></p>
      <div className="actions"><CopyBtn text={result} /></div>
      <Msg kind="status">A consistent pattern like this sorts naturally and makes files easy to search for later.</Msg>
    </div>
  )
}
