// Path: src/components/GameCard.jsx
import { Link } from "react-router-dom"
import styles from "./GameCard.module.css"

export default function GameCard({ game }) {
  return (
    <Link to={`/game/${game._id}`} className={styles.card}>
      <img src={game.media?.images[0]} alt={game.title} className={styles.image}/>
      <div className={styles.content}>
        <h2>{game.title}</h2>
        <p>${game.price}</p>
      </div>
    </Link>
  )
}
