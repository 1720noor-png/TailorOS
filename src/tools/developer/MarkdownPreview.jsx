import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function MarkdownPreview() {
  const [md, setMd] = useState('')
  const [html, setHtml] = useState('')

  const convert = () => {
    if (!md.trim()) return
    let h = md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^\- (.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/^---$/gm, '<hr/>')
      .replace(/\n\n/g, '</p><p>')
    setHtml('<p>' + h + '</p>')
  }

  return (
    <div>
      <Field label="Markdown"><textarea rows={8} value={md} onChange={e => setMd(e.target.value)} placeholder="# Heading&#10;**bold** *italic*&#10;- list item" style={{ fontFamily: 'monospace', fontSize: '.85rem' }} /></Field>
      <div className="actions"><button className="btn" onClick={convert}>Preview</button></div>
      {html && <div className="out" role="status">
        <div dangerouslySetInnerHTML={{ __html: html }} style={{ padding: 12 }} />
        <hr />
        <p style={{ fontSize: '.8rem', color: '#888' }}>HTML output:</p>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '.8rem', fontFamily: 'monospace' }}>{html}</pre>
        <CopyBtn text={html} />
      </div>}
      <p className="hint">Basic markdown to HTML preview.</p>
    </div>
  )
}
