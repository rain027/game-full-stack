import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API_URL } from "../config"

export default function GameDetails() {
  const { gameId } = useParams()
  const [game, setGame] = useState(null)
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetch(`${API_URL}/games/${gameId}`, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => setGame(data))
      .catch(err => console.error(err))
  }, [gameId, token])

  if (!game) return <p>Loading game...</p>

  return (
    <div>
      <h1>{game.title}</h1>
      <p>{game.description}</p>
      <p>Price: ${game.price}</p>
      <p>Rating: {game.rating} / 5</p>
      {game.media?.images.map((img, idx) => (
        <img key={idx} src={img} alt={game.title} width={300} />
      ))}
    </div>
  )
}
