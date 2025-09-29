import { useEffect, useState } from "react"
import { API_URL } from "../config"
import GameCard from "../components/GameCard.jsx"

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchWishlist()
  }, [token])

  const fetchWishlist = () => {
    if (!token) return
    fetch(`${API_URL}/users/wishlist`, {
      headers: { "Authorization": token }
    })
      .then(res => res.json())
      .then(data => setWishlist(data))
      .catch(err => console.error(err))
  }

  const removeFromWishlist = async (gameId) => {
    try {
      const res = await fetch(`${API_URL}/users/wishlist/${gameId}`, {
        method: 'DELETE',
        headers: { "Authorization": token }
      })
      if (res.ok) {
        fetchWishlist() // Refresh wishlist
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1>Your Wishlist</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {wishlist.length > 0 ? (
          wishlist.map(game => (
            <div key={game._id} style={{ position: 'relative' }}>
              <GameCard game={game} />
              <button
                onClick={() => removeFromWishlist(game._id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <p>No games in your wishlist.</p>
        )}
      </div>
    </div>
  )
}