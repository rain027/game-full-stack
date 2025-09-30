import { useEffect, useState } from "react"
import { API_URL } from "../config"
import { Link } from "react-router-dom"

export default function DeveloperDashboard() {
  const [games, setGames] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchGames()
  }, [token])

  const fetchGames = () => {
    if (!token) return
    fetch(`${API_URL}/developers/mygames`, {
      headers: { "Authorization": token }
    })
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error(err))
  }

  const handleDelete = async (gameId, gameTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${gameTitle}"?\n\nThis action cannot be undone.`)
    
    if (!confirmed) return

    try {
      const res = await fetch(`${API_URL}/games/${gameId}`, {
        method: 'DELETE',
        headers: { "Authorization": token }
      })
      
      const data = await res.json()
      
      if (res.ok) {
        alert("✅ Game deleted successfully!")
        fetchGames() // Refresh the list
      } else if (res.status === 403 && data.purchasedCount) {
        // Game has been purchased
        alert(`❌ Cannot delete this game!\n\n${data.msg}\n\nUsers who purchased it still need access to their content.`)
      } else {
        alert(data.msg || "Failed to delete game")
      }
    } catch (err) {
      console.error(err)
      alert("Error deleting game")
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Your Games</h1>
        <Link 
          to="/upload"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#a259ff',
            color: 'white',
            borderRadius: '6px',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}
        >
          + Upload New Game
        </Link>
      </div>

      {games.length > 0 ? (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {games.map(game => (
            <div 
              key={game._id} 
              style={{ 
                backgroundColor: '#222', 
                padding: '1.5rem', 
                borderRadius: '12px',
                display: 'flex',
                gap: '1.5rem'
              }}
            >
              {/* Game Image */}
              {game.media?.images[0] && (
                <img 
                  src={game.media.images[0]} 
                  alt={game.title}
                  style={{ 
                    width: '200px', 
                    height: '150px', 
                    objectFit: 'cover', 
                    borderRadius: '8px' 
                  }}
                />
              )}

              {/* Game Info */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{game.title}</h2>
                <p style={{ color: '#aaa', marginBottom: '0.5rem' }}>{game.description}</p>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.5rem' }}>
                  <p><strong>Price:</strong> ${game.price}</p>
                  <p><strong>Genre:</strong> {game.genre || 'N/A'}</p>
                </div>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                  <p>
                    <strong>Rating:</strong> ⭐ {game.rating.toFixed(1)} 
                    ({game.reviewsCount} {game.reviewsCount === 1 ? 'review' : 'reviews'})
                  </p>
                  <p><strong>Created:</strong> {new Date(game.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link
                    to={`/game/${game._id}`}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    👁️ View Details
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(game._id, game.title)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Delete Game
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#aaa' }}>You haven't uploaded any games yet.</p>
          <Link 
            to="/upload"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#a259ff',
              color: 'white',
              borderRadius: '6px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Upload Your First Game
          </Link>
        </div>
      )}
    </div>
  )
}