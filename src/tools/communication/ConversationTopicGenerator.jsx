import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

export default function ConversationTopicGenerator() {
  const [situation, setSituation] = useState('networking')
  const [topicIdx, setTopicIdx] = useState(0)

  const topicsBySituation = {
    networking: [
      { q: "What project or technology are you currently most excited about?", follow: "What inspired you to dive into that specific area?" },
      { q: "What is a industry trend you think people are underestimating right now?", follow: "How do you see that impacting work over the next year?" },
      { q: "What is the best professional advice or lesson you've received recently?", follow: "Who gave you that advice?" },
      { q: "How did you get started in your current role or field?", follow: "Was it a linear path or a surprising pivot?" }
    ],
    casual: [
      { q: "Have you watched or read anything recently that blew you away?", follow: "What genre or plot made it so engaging?" },
      { q: "If you could pick up any new skill instantly overnight, what would it be?", follow: "What would be the first thing you'd create with it?" },
      { q: "What is your favorite way to unwind on a weekend?", follow: "Do you prefer active outdoor plans or relaxing at home?" },
      { q: "Have you tried any new recipes or restaurants lately worth recommending?", follow: "What was the highlight dish?" }
    ],
    interview: [
      { q: "What is a challenging problem you solved recently that you're proud of?", follow: "What trade-offs did you make during the process?" },
      { q: "How do you prioritize competing tasks when deadlines overlap?", follow: "Can you give an example of how you managed stakeholder expectations?" },
      { q: "What team environment or communication style helps you perform at your best?", follow: "How do you handle constructive feedback?" }
    ],
    smalltalk: [
      { q: "Any upcoming trips or weekend plans you're looking forward to?", follow: "Is that a favorite spot of yours or a new destination?" },
      { q: "How is your week shaping up so far?", follow: "Any big milestones on the radar?" },
      { q: "Have you noticed how nice/wild the weather has been today?", follow: "Are you getting a chance to spend some time outside?" }
    ]
  }

  const list = topicsBySituation[situation] || topicsBySituation.networking
  const current = list[topicIdx % list.length]

  const nextTopic = () => {
    setTopicIdx((prev) => (prev + 1) % list.length)
  }

  const textToCopy = `Conversation Starter:\n"${current.q}"\n\nFollow-up Question:\n"${current.follow}"`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Select Communication Situation">
          <select
            value={situation}
            onChange={(e) => {
              setSituation(e.target.value)
              setTopicIdx(0)
            }}
          >
            <option value="networking">Professional Networking Event</option>
            <option value="casual">Casual Social / Friends</option>
            <option value="smalltalk">Light Workplace Small Talk</option>
            <option value="interview">Job Interview / Technical Discussion</option>
          </select>
        </Field>
      </div>

      <div className="out" style={{ marginTop: '1rem', minHeight: '130px' }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.6rem' }}>
          💬 "{current.q}"
        </div>
        <div className="hint">
          💡 <strong>Suggested Follow-Up:</strong> "{current.follow}"
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <button type="button" className="btn" onClick={nextTopic}>
          🎲 Shuffle / Next Topic
        </button>
        <CopyBtn text={textToCopy} label="Copy Topic Card" />
      </div>
    </div>
  )
}
