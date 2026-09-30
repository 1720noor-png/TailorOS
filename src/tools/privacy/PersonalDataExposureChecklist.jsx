import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function PersonalDataExposureChecklist() {
  const [checkedItems, setCheckedItems] = useState({})

  const checklistSections = [
    {
      category: 'Public Profile Visibility',
      items: [
        'Check public email addresses on personal blogs, GitHub, and social media profiles',
        'Verify personal phone numbers are hidden from public domain WHOIS & social profiles',
        'Review public location tags and check-ins on Instagram, X, and Facebook',
      ],
    },
    {
      category: 'Account Credential Security',
      items: [
        'Ensure unique passwords are used for every primary email and financial account',
        'Enable 2FA / Multi-Factor Authentication via Authenticator app (avoid SMS 2FA where possible)',
        'Check if email addresses appeared in known data breaches (e.g. HaveIBeenPwned)',
      ],
    },
    {
      category: 'Device & Data Backups',
      items: [
        'Verify disk encryption (BitLocker / FileVault) is active on primary laptop',
        'Review app permissions on mobile device (Camera, Location, Contacts, Microphone access)',
        'Check cloud storage sharing settings for sensitive folders (Google Drive, OneDrive, iCloud)',
      ],
    },
  ]

  const toggleCheck = (item) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  const allItems = checklistSections.flatMap((s) => s.items)
  const checkedCount = Object.keys(checkedItems).filter((k) => checkedItems[k]).length

  const reportText = `Personal Data Exposure Security Review Checklist
--------------------------------------------------------------
Overall Progress: ${checkedCount} / ${allItems.length} items completed

${checklistSections
  .map(
    (s) =>
      `[ ${s.category} ]\n` +
      s.items.map((i) => `  [${checkedItems[i] ? 'X' : ' '}] ${i}`).join('\n')
  )
  .join('\n\n')}`

  return (
    <div className="tool-body">
      <div className="out">
        <div>Review Audit Progress: <strong>{checkedCount} / {allItems.length} exposure points audited</strong></div>
        <div className="meter" style={{ marginTop: '0.6rem' }}>
          <span style={{ width: `${(checkedCount / allItems.length) * 100}%` }} />
        </div>
      </div>

      {checklistSections.map((sec) => (
        <div key={sec.category} style={{ marginTop: '1.2rem' }}>
          <h3>{sec.category}</h3>
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
        <CopyBtn text={reportText} label="Copy Audit Checklist" />
        <button type="button" className="btn ghost" onClick={() => download('data-exposure-checklist.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
