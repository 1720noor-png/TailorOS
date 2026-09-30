import { useState } from 'react'

export default function QuizGenerator() {
  const [passage, setPassage] = useState('')
  const [numQuestions, setNumQuestions] = useState(3)
  const [quiz, setQuiz] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const generateQuiz = () => {
    if (!passage.trim()) return

    const sentences = passage.match(/[^.!?]+[.!?]+/g) || [passage]
    const validSentences = sentences.filter((s) => s.trim().length > 20)

    if (validSentences.length === 0) return

    // Extract vocabulary bank from passage for real distractors
    const allWords = Array.from(new Set(passage.toLowerCase().match(/\b[a-z]{4,}\b/g) || []))
    const stopWords = new Set(['this','that','with','from','they','them','have','been','were','which','their','other','about','there'])
    const distractorBank = allWords.filter((w) => !stopWords.has(w))

    const generated = []
    const count = Math.min(numQuestions, validSentences.length)

    for (let i = 0; i < count; i++) {
      const sentence = validSentences[i].trim()
      const words = sentence.match(/\b[a-zA-Z0-9_-]{4,}\b/g) || []

      if (words.length === 0) continue

      // Pick a target answer word from the sentence
      const targetWord = words[Math.floor(Math.random() * words.length)]
      const questionText = sentence.replace(new RegExp(`\\b${targetWord}\\b`, 'i'), '_______')

      // Get real distractor choices from the document's vocabulary bank
      const otherChoices = distractorBank
        .filter((w) => w.toLowerCase() !== targetWord.toLowerCase())
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)

      // Capitalize choices cleanly if target word was capitalized
      const formatWord = (w) => (targetWord[0] === targetWord[0].toUpperCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w)

      const options = [targetWord, ...otherChoices.map(formatWord)].sort(() => 0.5 - Math.random())

      generated.push({
        id: i,
        question: questionText,
        correctAnswer: targetWord.toLowerCase(),
        options
      })
    }

    setQuiz(generated)
    setUserAnswers({})
    setSubmitted(false)
  }

  const handleSelectOption = (qId, option) => {
    if (submitted) return
    setUserAnswers((prev) => ({ ...prev, [qId]: option.toLowerCase() }))
  }

  const calculateScore = () => {
    let score = 0
    quiz.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) score++
    })
    return score
  }

  return (
    <div className="panel">
      <h2>Quiz & Flashcard Question Generator</h2>
      <p className="hint">Generate realistic multiple-choice practice quizzes from your study materials.</p>

      <div className="field">
        <span>Paste Study Passage / Notes</span>
        <textarea rows={6} value={passage} onChange={(e) => setPassage(e.target.value)} placeholder="Paste textbook passage or lesson notes here..." />
      </div>

      <div className="field">
        <span>Number of Questions</span>
        <select value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value))}>
          <option value={3}>3 Questions</option>
          <option value={5}>5 Questions</option>
          <option value={10}>10 Questions</option>
        </select>
      </div>

      <div className="actions">
        <button className="btn" disabled={!passage.trim()} onClick={generateQuiz}>Generate Quiz</button>
      </div>

      {quiz.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Interactive Quiz</h3>
          {quiz.map((q, idx) => (
            <div key={q.id} className="doc" style={{ marginBottom: '1rem' }}>
              <strong>Question {idx + 1}:</strong> {q.question}
              <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {q.options.map((opt, i) => {
                  const isSelected = userAnswers[q.id] === opt.toLowerCase()
                  const isCorrect = q.correctAnswer === opt.toLowerCase()

                  let btnClass = 'btn ghost'
                  let style = {}
                  if (submitted) {
                    if (isCorrect) {
                      style = { background: 'var(--ok)', color: '#fff', borderColor: 'var(--ok)' }
                    } else if (isSelected && !isCorrect) {
                      style = { background: 'var(--bad)', color: '#fff', borderColor: 'var(--bad)' }
                    }
                  } else if (isSelected) {
                    style = { borderColor: 'var(--brand)', background: 'var(--card)', fontWeight: 700 }
                  }

                  return (
                    <button key={i} className={btnClass} style={{ textAlign: 'left', ...style }} onClick={() => handleSelectOption(q.id, opt)}>
                      {String.fromCharCode(65 + i)}. {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {!submitted ? (
            <button className="btn" disabled={Object.keys(userAnswers).length < quiz.length} onClick={() => setSubmitted(true)}>
              Submit Answers
            </button>
          ) : (
            <div className="out" style={{ marginTop: '1rem' }}>
              <h3>Your Results</h3>
              <p style={{ fontSize: '1.2rem' }}>
                Score: <strong>{calculateScore()} / {quiz.length}</strong> ({Math.round((calculateScore() / quiz.length) * 100)}%)
              </p>
              <button className="btn ghost" onClick={generateQuiz}>Try Another Quiz</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
