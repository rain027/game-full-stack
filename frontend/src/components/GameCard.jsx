// Path: src/components/GameCard.jsx
import { Link } from "react-router-dom"
import styles from "./GameCard.module.css"

export default function GameCard({ game }) {
  return (
    <Link to={`/game/${game._id}`} className={styles.card}>
      <img 
        src={game.media?.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
        alt={game.title} 
        className={styles.image}
      />
      <div className={styles.content}>
        <h2>{game.title}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: '#a259ff', fontWeight: 'bold' }}>
            ${game.price}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ color: '#FFD700' }}>★</span>
            <span style={{ fontSize: '0.9rem' }}>
              {game.rating.toFixed(1)}
            </span>
          </div>
        </div>
        {game.reviewsCount > 0 && (
          <p style={{ fontSize: '0.8rem', color: '#888' }}>
            {game.reviewsCount} {game.reviewsCount === 1 ? 'review' : 'reviews'}
          </p>
        )}
      </div>
    </Link>
  )
}