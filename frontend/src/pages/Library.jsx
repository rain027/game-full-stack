import { useEffect, useState } from "react"
import { API_URL } from "../config"
import GameCard from "../components/GameCard.jsx"

export default function Library() {
  const [library, setLibrary] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/users/library`, {
      headers: { "Authorization": token }
    })
      .then(res => res.json())
      .then(data => setLibrary(data))
      .catch(err => console.error(err))
  }, [token])

  return (
    <div>
      <h1>Your Library</h1>
      <p style={{ marginBottom: '1rem', color: '#aaa' }}>
        Games you own - {library.length} {library.length === 1 ? 'game' : 'games'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {library.length > 0 ? (
          library.map(game => <GameCard key={game._id} game={game} />)
        ) : (
          <p>No purchased games yet.</p>
        )}
      </div>
    </div>
  )
}