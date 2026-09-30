import { useState, useEffect } from 'react'

const STORAGE_KEY = 'toolhub_quick_notes'

export default function QuickNotes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [activeNoteId, setActiveNoteId] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setNotes(parsed)
        if (parsed.length > 0) {
          setActiveNoteId(parsed[0].id)
          setTitle(parsed[0].title)
          setContent(parsed[0].content)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const saveNotesToStorage = (updated) => {
    setNotes(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    const updated = [newNote, ...notes]
    saveNotesToStorage(updated)
    setActiveNoteId(newNote.id)
    setTitle(newNote.title)
    setContent(newNote.content)
  }

  const selectNote = (note) => {
    setActiveNoteId(note.id)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleTitleChange = (val) => {
    setTitle(val)
    if (!activeNoteId) return
    const updated = notes.map((n) =>
      n.id === activeNoteId ? { ...n, title: val, updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : n
    )
    saveNotesToStorage(updated)
  }

  const handleContentChange = (val) => {
    setContent(val)
    if (!activeNoteId) return
    const updated = notes.map((n) =>
      n.id === activeNoteId ? { ...n, content: val, updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : n
    )
    saveNotesToStorage(updated)
  }

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id)
    saveNotesToStorage(updated)
    if (activeNoteId === id) {
      if (updated.length > 0) {
        selectNote(updated[0])
      } else {
        setActiveNoteId(null)
        setTitle('')
        setContent('')
      }
    }
  }

  return (
    <div className="panel">
      <h2>Quick Scratchpad Notes</h2>
      <p className="hint">Fast, distraction-free notes auto-saved in your browser.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ borderRight: '1px solid var(--line)', paddingRight: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <strong>Notes ({notes.length})</strong>
            <button className="btn ghost" style={{ padding: '0.2rem 0.5rem' }} onClick={createNewNote}>+ New Note</button>
          </div>

          {notes.length === 0 ? (
            <p className="hint">No notes created yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {notes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => selectNote(n)}
                  style={{
                    padding: '0.5rem 0.7rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: activeNoteId === n.id ? 'var(--card)' : 'transparent',
                    border: activeNoteId === n.id ? '1px solid var(--brand)' : '1px solid transparent'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.title || 'Untitled'}
                  </div>
                  <div className="hint" style={{ fontSize: '0.75rem' }}>{n.updatedAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {activeNoteId ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Note Title..."
                  style={{ fontWeight: 700, fontSize: '1.2rem', border: 'none', background: 'transparent', padding: 0 }}
                />
                <button className="btn ghost" style={{ color: 'var(--bad)', padding: '0.2rem 0.5rem' }} onClick={() => deleteNote(activeNoteId)}>
                  Delete Note
                </button>
              </div>
              <textarea
                rows={14}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start typing your note here..."
                style={{ width: '100%' }}
              />
            </div>
          ) : (
            <div className="empty">Select a note from the left sidebar or click "+ New Note" to start writing.</div>
          )}
        </div>
      </div>
    </div>
  )
}
