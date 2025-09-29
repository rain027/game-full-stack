import { useEffect, useState } from "react"
import { API_URL } from "../config"
import GameCard from "../components/GameCard.jsx"

export default function Cart() {
  const [cart, setCart] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/users/cart`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCart(data))
      .catch(err => console.error(err))
  }, [token])

  return (
    <div>
      <h1>Your Cart</h1>
      <div>
        {cart.length > 0
          ? cart.map(game => <GameCard key={game._id} game={game} />)
          : <p>No games in your cart.</p>
        }
      </div>
    </div>
  )
}
