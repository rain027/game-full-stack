import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import GameCard from "../components/GameCard.jsx"

export default function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [token])

  const fetchCart = () => {
    if (!token) return
    fetch(`${API_URL}/users/cart`, {
      headers: { "Authorization": token }
    })
      .then(res => res.json())
      .then(data => setCart(data))
      .catch(err => console.error(err))
  }

  const removeFromCart = async (gameId) => {
    try {
      const res = await fetch(`${API_URL}/users/cart/${gameId}`, {
        method: 'DELETE',
        headers: { "Authorization": token }
      })
      if (res.ok) {
        fetchCart() // Refresh cart
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handlePurchase = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/users/purchase`, {
        method: 'POST',
        headers: { 
          "Authorization": token,
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      if (res.ok) {
        alert(`Purchase successful! Total: $${data.totalAmount.toFixed(2)}`)
        navigate("/library")
      } else {
        alert(data.msg || "Purchase failed")
      }
    } catch (err) {
      console.error(err)
      alert("Purchase error")
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = cart.reduce((sum, game) => sum + (game.price || 0), 0)

  return (
    <div>
      <h1>Your Cart</h1>
      
      {cart.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {cart.map(game => (
              <div key={game._id} style={{ position: 'relative' }}>
                <GameCard game={game} />
                <button
                  onClick={() => removeFromCart(game._id)}
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
            ))}
          </div>
          
          <div style={{ 
            backgroundColor: '#222', 
            padding: '1.5rem', 
            borderRadius: '12px',
            maxWidth: '400px'
          }}>
            <h2>Total: ${totalPrice.toFixed(2)}</h2>
            <button
              onClick={handlePurchase}
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: loading ? '#666' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '1rem'
              }}
            >
              {loading ? 'Processing...' : 'Purchase Now'}
            </button>
          </div>
        </>
      ) : (
        <p>No games in your cart.</p>
      )}
    </div>
  )
}