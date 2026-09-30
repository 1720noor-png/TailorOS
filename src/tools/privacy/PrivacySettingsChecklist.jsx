import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function PrivacySettingsChecklist() {
  const [checkedItems, setCheckedItems] = useState({})

  const sections = [
    {
      platform: 'Browser Privacy Hardening',
      items: [
        'Disable 3rd-party cookies & enable strict tracking protection in browser settings',
        'Install reputable privacy extensions (uBlock Origin / Privacy Badger)',
        'Clear browser cache, cookies, and local storage periodically',
        'Disable search engine query autocomplete and telemetry data collection',
      ],
    },
    {
      platform: 'Social Media & Online Services',
      items: [
        'Set profile visibility to "Friends Only" or "Private" on Facebook, Instagram & X',
        'Turn off ad personalization and off-platform activity tracking',
        'Revoke third-party OAuth app authorizations for inactive web services',
        'Disable facial recognition and automatic tagging in photos',
      ],
    },
    {
      platform: 'Mobile Operating System (iOS / Android)',
      items: [
        'Disable location services for non-essential apps (set to "While Using" or "Never")',
        'Turn off personalized ad identifiers (Limit Ad Tracking / Opt out of Ads Personalization)',
        'Check background app refresh permissions for battery & data privacy',
      ],
    },
  ]

  const toggleCheck = (item) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  const allItems = sections.flatMap((s) => s.items)
  const checkedCount = Object.keys(checkedItems).filter((k) => checkedItems[k]).length

  const reportText = `Privacy Settings Hardening Review Checklist
------------------------------------------------------------
Progress: ${checkedCount} / ${allItems.length} privacy settings hardened

${sections
  .map(
    (s) =>
      `[ ${s.platform} ]\n` +
      s.items.map((i) => `  [${checkedItems[i] ? 'X' : ' '}] ${i}`).join('\n')
  )
  .join('\n\n')}`

  return (
    <div className="tool-body">
      <div className="out">
        <div>Hardening Audit Progress: <strong>{checkedCount} / {allItems.length} privacy settings verified</strong></div>
        <div className="meter" style={{ marginTop: '0.6rem' }}>
          <span style={{ width: `${(checkedCount / allItems.length) * 100}%` }} />
        </div>
      </div>

      {sections.map((sec) => (
        <div key={sec.platform} style={{ marginTop: '1.2rem' }}>
          <h3>{sec.platform}</h3>
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
        <CopyBtn text={reportText} label="Copy Privacy Hardening Plan" />
        <button type="button" className="btn ghost" onClick={() => download('privacy-settings-checklist.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
