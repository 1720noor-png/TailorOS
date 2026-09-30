import { CopyBtn, download } from './ui.jsx'
import { esc, printHtml } from './print.js'
export default function DocOut({ text, title, filename }) {
  return (
    <div>
      <pre className="doc">{text}</pre>
      <div className="actions">
        <CopyBtn text={text} />
        <button className="btn ghost" onClick={() => download(filename, text)}>Download</button>
        <button className="btn ghost" onClick={() => printHtml(title, `<pre>${esc(text)}</pre>`)}>Print</button>
      </div>
    </div>
  )
}
