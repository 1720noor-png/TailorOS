import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function SecureFileSharingChecklist() {
  const [checkedItems, setCheckedItems] = useState({})

  const sections = [
    {
      stage: 'Pre-Share File Preparation',
      items: [
        'Strip EXIF & GPS location metadata from photos before emailing or sharing online',
        'Inspect PDF author, track changes, and hidden comments before external distribution',
        'Compress sensitive documents into a password-protected encrypted archive (7z / ZIP AES-256)',
        'Verify document content contains no unmasked PII (SSN, credit card numbers, secret keys)',
      ],
    },
    {
      stage: 'Sharing Method & Expiration Controls',
      items: [
        'Use end-to-end encrypted or zero-knowledge file sharing links (or self-destructing links)',
        'Set link expiration dates (e.g. 7 days or 24 hours max)',
        'Set explicit permissions to "View Only" to prevent unauthorized editing or downloading',
        'Send access passwords over a separate channel (e.g. Signal / SMS) than the file link',
      ],
    },
  ]

  const toggleCheck = (item) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  const allItems = sections.flatMap((s) => s.items)
  const checkedCount = Object.keys(checkedItems).filter((k) => checkedItems[k]).length

  const reportText = `Secure File Sharing Safety Review Checklist
------------------------------------------------------------
Progress: ${checkedCount} / ${allItems.length} checks completed

${sections
  .map(
    (s) =>
      `[ ${s.stage} ]\n` +
      s.items.map((i) => `  [${checkedItems[i] ? 'X' : ' '}] ${i}`).join('\n')
  )
  .join('\n\n')}`

  return (
    <div className="tool-body">
      <div className="out">
        <div>Pre-Share Safety Progress: <strong>{checkedCount} / {allItems.length} safety precautions verified</strong></div>
        <div className="meter" style={{ marginTop: '0.6rem' }}>
          <span style={{ width: `${(checkedCount / allItems.length) * 100}%` }} />
        </div>
      </div>

      {sections.map((sec) => (
        <div key={sec.stage} style={{ marginTop: '1.2rem' }}>
          <h3>{sec.stage}</h3>
          <div className="items">
            {sec.items.map((item) => (
              <label key={item} className="item" style={{ cursor: 'pointer' }}>
                <span
                  style={{
                    textDecoration: checkedItems[item] ? 'line-through' : 'none',
                    opacity: checkedItems[item] ? 0.6 : 1,
                  }}
                >
                  {item}
                </span>
                <input
                  type="checkbox"
                  checked={!!checkedItems[item]}
                  onChange={() => toggleCheck(item)}
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="actions" style={{ marginTop: '1.2rem' }}>
        <CopyBtn text={reportText} label="Copy File Sharing Checklist" />
        <button type="button" className="btn ghost" onClick={() => download('file-sharing-checklist.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
