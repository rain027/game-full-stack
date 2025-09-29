import { useEffect, useState } from "react"
import GameCard from "../components/GameCard.jsx"
import { API_URL } from "../config"
import styles from "./pages.module.css"

export default function Home() {
  const [featuredGames, setFeaturedGames] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then(res => res.json())
      .then(data => setFeaturedGames(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1 className={styles.title}>Welcome to Indie Vault</h1>
      <p className={styles.subtitle}>Discover amazing indie games, rate them, and explore new titles.</p>

      <h2 className={styles.sectionTitle}>Featured Games</h2>
      <div className={styles.grid}>
        {featuredGames.length > 0
          ? featuredGames.map(game => <GameCard key={game._id} game={game} />)
          : <p>Loading games...</p>
        }
      </div>
    </div>
  )
}
