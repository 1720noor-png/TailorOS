import { useState, useEffect } from 'react'

const FAVS_KEY = 'vimztools_favorites'
const RECENTS_KEY = 'vimztools_recents'

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(FAVS_KEY, JSON.stringify(favorites))
    } catch (e) {
      console.warn('Storage unavailable', e)
    }
  }, [favorites])

  const toggleFavorite = (slug) => {
    setFavorites(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [slug, ...prev]
    )
  }

  const isFavorite = (slug) => favorites.includes(slug)

  return { favorites, toggleFavorite, isFavorite }
}

export function useRecentTools() {
  const [recents, setRecents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]')
    } catch {
      return []
    }
  })

  const addRecent = (slug) => {
    setRecents(prev => {
      const next = [slug, ...prev.filter(s => s !== slug)].slice(0, 12)
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      } catch (e) {
        console.warn('Storage unavailable', e)
      }
      return next
    })
  }

  const clearRecents = () => {
    setRecents([])
    try {
      localStorage.removeItem(RECENTS_KEY)
    } catch {}
  }

  return { recents, addRecent, clearRecents }
}
