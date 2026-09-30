import { useState, useEffect } from 'react'

const STORAGE_KEY = 'toolhub_blog_library'

export default function BlogWriter() {
  const [tab, setTab] = useState('editor') // 'editor' | 'library'
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('Technology')
  const [outline, setOutline] = useState('')
  const [content, setContent] = useState('')
  const [posts, setPosts] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setPosts(JSON.parse(saved))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const savePostsToStorage = (updated) => {
    setPosts(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error('Storage error:', e)
      setMsg('Error saving post: Local storage quota exceeded.')
    }
  }

  const generateDraft = () => {
    if (!title.trim()) return

    const sections = outline ? outline.split('\n').filter((s) => s.trim()) : ['Introduction', 'Key Concepts', 'Conclusion']
    let draft = `# ${title}\n\n`
    if (subtitle) draft += `*${subtitle}*\n\n`
    draft += `**Category:** ${category} | **Date:** ${new Date().toLocaleDateString()}\n\n---\n\n`

    sections.forEach((sec) => {
      draft += `## ${sec.trim()}\n\nWrite detailed paragraphs regarding ${sec.toLowerCase()} here...\n\n`
    })

    setContent(draft)
  }

  const handleSavePost = () => {
    if (!title.trim() || !content.trim()) return

    const newPost = {
      id: editingId || Date.now().toString(),
      title,
      subtitle,
      category,
      content,
      date: new Date().toLocaleDateString()
    }

    let updated
    if (editingId) {
      updated = posts.map((p) => (p.id === editingId ? newPost : p))
      setEditingId(null)
    } else {
      updated = [newPost, ...posts]
    }

    savePostsToStorage(updated)
    setMsg('Post saved to local blog library!')
    setTimeout(() => setMsg(''), 3000)
  }

  const handleEditPost = (post) => {
    setTitle(post.title)
    setSubtitle(post.subtitle || '')
    setCategory(post.category || 'General')
    setContent(post.content)
    setEditingId(post.id)
    setTab('editor')
  }

  const handleDeletePost = (id) => {
    const updated = posts.filter((p) => p.id !== id)
    savePostsToStorage(updated)
  }

  const handleExportMarkdown = (post) => {
    const blob = new Blob([post.content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`
    a.click()
  }

  return (
    <div className="panel">
      <h2>Blog Writer & Library</h2>
      <p className="hint">Write, structure, draft, and store blog posts locally in your personal writing library.</p>

      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        <button className={`btn ${tab === 'editor' ? '' : 'ghost'}`} onClick={() => setTab('editor')}>✍️ Writer / Editor</button>
        <button className={`btn ${tab === 'library' ? '' : 'ghost'}`} onClick={() => setTab('library')}>📚 Blog Library ({posts.length})</button>
      </div>

      {msg && <div className="msg ok">{msg}</div>}

      {tab === 'editor' ? (
        <div>
          <div className="row">
            <div className="field">
              <span>Article Title</span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 10 Essential Productivity Tools" />
            </div>

            <div className="field">
              <span>Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Technology">Technology</option>
                <option value="Productivity">Productivity</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Finance">Finance</option>
                <option value="Career">Career</option>
              </select>
            </div>
          </div>

          <div className="field">
            <span>Subtitle / Tagline (Optional)</span>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. A comprehensive guide for remote teams" />
          </div>

          <div className="field">
            <span>Article Outline / Subheadings (One per line)</span>
            <textarea
              rows={3}
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
              placeholder="e.g. Introduction&#10;Why Tools Matter&#10;Top Recommendations&#10;Final Thoughts"
            />
          </div>

          <div className="actions">
            <button className="btn ghost" disabled={!title.trim()} onClick={generateDraft}>Generate Outline Draft</button>
            <button className="btn" disabled={!title.trim() || !content.trim()} onClick={handleSavePost}>
              {editingId ? 'Update Post in Library' : 'Save to Library'}
            </button>
          </div>

          <div className="field" style={{ marginTop: '1.2rem' }}>
            <span>Blog Post Content (Markdown Format)</span>
            <textarea rows={12} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your full article markdown content here..." />
          </div>
        </div>
      ) : (
        <div>
          <h3>Saved Blog Posts</h3>
          {posts.length === 0 ? (
            <div className="empty">No blog posts saved yet. Switch to the Writer tab to create your first article!</div>
          ) : (
            <ul className="items">
              {posts.map((post) => (
                <li key={post.id} className="item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem' }}>{post.title}</strong>
                      <span className="hint" style={{ marginLeft: '0.8rem' }}>({post.category} • {post.date})</span>
                    </div>
                    <div className="actions" style={{ margin: 0 }}>
                      <button className="btn ghost" onClick={() => handleEditPost(post)}>Edit</button>
                      <button className="btn ghost" onClick={() => handleExportMarkdown(post)}>Download .md</button>
                      <button className="btn ghost" style={{ color: 'var(--bad)' }} onClick={() => handleDeletePost(post.id)}>Delete</button>
                    </div>
                  </div>
                  {post.subtitle && <p className="hint" style={{ margin: '0.2rem 0 0.5rem' }}>{post.subtitle}</p>}
                  <div className="doc" style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.85rem' }}>
                    {post.content}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
