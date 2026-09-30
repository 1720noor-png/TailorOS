import { Link } from 'react-router-dom'
import { categories } from '../data/registry.js'
import { useFavorites } from '../utils/userPrefs.js'

export default function ToolCard({ t, onFavoriteChange }) {
  const c = categories.find((x) => x.slug === t.cat)
  const accent = c?.accent || 'blue'
  const { isFavorite, toggleFavorite } = useFavorites()
  const favored = isFavorite(t.slug)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(t.slug)
    if (onFavoriteChange) onFavoriteChange(t.slug)
  }

  return (
    <div className={'tool accent-' + accent}>
      <div className="tool-top">
        <span className="ico" aria-hidden="true">{t.icon}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {t.popular && <span className="badge popular">Popular</span>}
          <button 
            type="button" 
            className={'fav-btn' + (favored ? ' active' : '')} 
            onClick={handleFavoriteClick} 
            title={favored ? 'Remove from favorites' : 'Save to favorites'}
            aria-label={favored ? `Remove ${t.name} from favorites` : `Add ${t.name} to favorites`}
          >
            {favored ? '★' : '☆'}
          </button>
        </div>
      </div>
      <Link to={`/${t.cat}/${t.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3>{t.name}</h3>
        <p>{t.desc}</p>
        {t.subcatName && (
          <span className="badges" style={{ marginTop: '.5rem' }}>
            <span className="badge sub">{t.subcatName}</span>
          </span>
        )}
        <p className="why"><b>Why useful?</b> {t.why}</p>
        <span className="open">Open tool →</span>
      </Link>
    </div>
  )
}
