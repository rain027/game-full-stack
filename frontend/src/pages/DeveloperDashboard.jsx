import { useEffect, useState } from "react"
import { API_URL } from "../config"
import GameCard from "../components/GameCard.jsx"

export default function DeveloperDashboard() {
  const [games, setGames] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/developers/mygames`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error(err))
  }, [token])

  return (
    <div>
      <h1>Your Games</h1>
      <div>
        {games.length > 0
          ? games.map(game => <GameCard key={game._id} game={game} />)
          : <p>You haven’t uploaded any games yet.</p>
        }
      </div>
    </div>
  )
}
