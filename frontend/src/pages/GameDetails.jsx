import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API_URL } from "../config"
import RatingStars from "../components/RatingStars"

export default function GameDetails() {
  const { gameId } = useParams()
  const [game, setGame] = useState(null)
  const [inWishlist, setInWishlist] = useState(false)
  const [inCart, setInCart] = useState(false)
  const [inLibrary, setInLibrary] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userRole, setUserRole] = useState(null)
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchGame()
    
    // Get user role from token
    if (token) {
      try {
        const payload = token.split('.')[1]
        const decoded = JSON.parse(atob(payload))
        setUserRole(decoded.role)
        
        // Only check collections for regular users
        if (decoded.role === 'user') {
          checkUserCollections()
        }
      } catch (err) {
        console.error("Error decoding token:", err)
      }
    }
  }, [gameId, token])

  const fetchGame = () => {
    fetch(`${API_URL}/games/${gameId}`, {
      headers: token ? { "Authorization": token } : {}
    })
      .then(res => res.json())
      .then(data => setGame(data))
      .catch(err => console.error(err))
  }

  const checkUserCollections = async () => {
    try {
      // Check wishlist
      const wishlistRes = await fetch(`${API_URL}/users/wishlist`, {
        headers: { "Authorization": token }
      })
      const wishlist = await wishlistRes.json()
      setInWishlist(wishlist.some(g => g._id === gameId))

      // Check cart
      const cartRes = await fetch(`${API_URL}/users/cart`, {
        headers: { "Authorization": token }
      })
      const cart = await cartRes.json()
      setInCart(cart.some(g => g._id === gameId))

      // Check library
      const libraryRes = await fetch(`${API_URL}/users/library`, {
        headers: { "Authorization": token }
      })
      const library = await libraryRes.json()
      setInLibrary(library.some(g => g._id === gameId))
    } catch (err) {
      console.error(err)
    }
  }

  const addToWishlist = async () => {
    try {
      const res = await fetch(`${API_URL}/users/wishlist/${gameId}`, {
        method: 'POST',
        headers: { "Authorization": token }
      })
      if (res.ok) {
        setInWishlist(true)
        alert("Added to wishlist!")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const addToCart = async () => {
    try {
      const res = await fetch(`${API_URL}/users/cart/${gameId}`, {
        method: 'POST',
        headers: { "Authorization": token }
      })
      if (res.ok) {
        setInCart(true)
        alert("Added to cart!")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRate = async (rating) => {
    if (!inLibrary) {
      alert("You must own this game to rate it!")
      return
    }

    try {
      const res = await fetch(`${API_URL}/games/${gameId}/rate`, {
        method: 'POST',
        headers: { 
          "Authorization": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ rating })
      })
      if (res.ok) {
        setUserRating(rating)
        alert(`You rated this game ${rating} stars!`)
        fetchGame() // Refresh game data to show updated rating
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (!game) return <p>Loading game...</p>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {game.media?.images[0] && (
        <img 
          src={game.media.images[0]} 
          alt={game.title} 
          style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }}
        />
      )}
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{game.title}</h1>
      <p style={{ fontSize: '1.5rem', color: '#a259ff', marginBottom: '1rem' }}>
        ${game.price}
      </p>
      
      <p style={{ marginBottom: '1rem' }}>{game.description}</p>
      
      {game.genre && (
        <p><strong>Genre:</strong> {game.genre}</p>
      )}
      
      {game.tags && game.tags.length > 0 && (
        <p><strong>Tags:</strong> {game.tags.join(', ')}</p>
      )}
      
      <div style={{ marginBottom: '1.5rem' }}>
        <p><strong>Average Rating:</strong> {game.rating.toFixed(1)} / 5.0 ({game.reviewsCount} reviews)</p>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ fontSize: '1.5rem', color: i < Math.round(game.rating) ? '#FFD700' : '#555' }}>
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Rating Section - Only if user owns the game */}
      {userRole === 'user' && inLibrary && (
        <div style={{ 
          backgroundColor: '#222', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem' 
        }}>
          <h3>Rate this game:</h3>
          <RatingStars rating={userRating} onRate={handleRate} />
          {userRating > 0 && (
            <p style={{ color: '#4CAF50', marginTop: '0.5rem' }}>
              You rated this game {userRating} stars!
            </p>
          )}
        </div>
      )}
      
      {/* Only show purchase/wishlist/cart buttons for regular users */}
      {userRole === 'user' && (
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {inLibrary ? (
            <button 
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                cursor: 'not-allowed',
                fontWeight: 'bold'
              }}
              disabled
            >
              ✓ In Library
            </button>
          ) : (
            <>
              {!inCart ? (
                <button 
                  onClick={addToCart}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#a259ff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  🛒 Add to Cart
                </button>
              ) : (
                <button 
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#666', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px',
                    cursor: 'not-allowed',
                    fontWeight: 'bold'
                  }}
                  disabled
                >
                  ✓ In Cart
                </button>
              )}
              
              {!inWishlist ? (
                <button 
                  onClick={addToWishlist}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ♡ Add to Wishlist
                </button>
              ) : (
                <button 
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#666', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px',
                    cursor: 'not-allowed',
                    fontWeight: 'bold'
                  }}
                  disabled
                >
                  ♥ In Wishlist
                </button>
              )}
            </>
          )}
        </div>
      )}

      {userRole === 'user' && !inLibrary && (
        <p style={{ marginTop: '1rem', color: '#aaa', fontSize: '0.9rem' }}>
          💡 Purchase this game to leave a rating!
        </p>
      )}

      {userRole === 'developer' && (
        <p style={{ marginTop: '1rem', color: '#aaa', fontSize: '0.9rem' }}>
          👨‍💻 Developer view - Users will see purchase options here
        </p>
      )}
    </div>
  )
}