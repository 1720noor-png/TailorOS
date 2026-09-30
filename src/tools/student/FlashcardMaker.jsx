import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { useStored, uid } from '../../components/hooks.js'
export default function FlashcardMaker() {
  const [cards, setCards] = useStored('toolhub.flashcards', [])
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [edit, setEdit] = useState(null)
  const [err, setErr] = useState('')
  const [rev, setRev] = useState(null)
  const save = () => {
    if (!front.trim() || !back.trim()) return setErr('Both the front and the back are required.')
    setCards(edit ? cards.map((c) => (c.id === edit ? { ...c, front: front.trim(), back: back.trim() } : c)) : [...cards, { id: uid(), front: front.trim(), back: back.trim() }])
    setFront(''); setBack(''); setEdit(null); setErr('')
  }
  const start = () => {
    if (!cards.length) return setErr('Create at least one card before reviewing.')
    const order = cards.map((c) => c.id)
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]] }
    setErr(''); setRev({ order, i: 0, flip: false, known: 0 })
  }
  if (rev) {
    const done = rev.i >= rev.order.length
    const card = !done && cards.find((c) => c.id === rev.order[rev.i])
    const next = (k) => setRev({ ...rev, i: rev.i + 1, flip: false, known: rev.known + k })
    return (
      <div>
        {done ? <p className="out" role="status">Finished: you knew <strong>{rev.known}</strong> of {rev.order.length} cards.</p> : <>
          <p className="center">Card {rev.i + 1} of {rev.order.length}</p>
          <button className="flash" onClick={() => setRev({ ...rev, flip: !rev.flip })} aria-label="Flip card">{card ? (rev.flip ? card.back : card.front) : ''}</button>
          <p className="hint center">Select the card to flip it.</p>
          <div className="actions center"><button className="btn ghost" onClick={() => next(0)}>Again</button><button className="btn" onClick={() => next(1)}>Got it</button></div></>}
        <div className="actions center">{done && <button className="btn" onClick={start}>Review again</button>}<button className="btn ghost" onClick={() => setRev(null)}>Back to cards</button></div>
      </div>
    )
  }
  return (
    <div>
      <Field label="Front (question)"><textarea rows="2" value={front} onChange={(e) => setFront(e.target.value)} /></Field>
      <Field label="Back (answer)"><textarea rows="2" value={back} onChange={(e) => setBack(e.target.value)} /></Field>
      <div className="actions">
        <button className="btn" onClick={save}>{edit ? 'Save changes' : 'Add card'}</button>
        {edit && <button className="btn ghost" onClick={() => { setEdit(null); setFront(''); setBack('') }}>Cancel edit</button>}
        <button className="btn ghost" onClick={start}>Review cards</button>
      </div>
      <Msg>{err}</Msg>
      {!cards.length && <div className="empty"><p>No cards yet. Add a question and answer above.</p></div>}
      <ul className="items">{cards.map((c) => (
        <li className="item" key={c.id}><div><strong>{c.front}</strong><br />{c.back}</div>
          <div className="actions"><button className="btn ghost" onClick={() => { setEdit(c.id); setFront(c.front); setBack(c.back) }}>Edit</button>
            <button className="btn ghost" onClick={() => { setCards(cards.filter((x) => x.id !== c.id)); if (edit === c.id) { setEdit(null); setFront(''); setBack('') } }}>Delete</button></div></li>
      ))}</ul>
      <p className="hint">{cards.length} card{cards.length === 1 ? '' : 's'}, saved only in this browser.</p>
    </div>
  )
}
