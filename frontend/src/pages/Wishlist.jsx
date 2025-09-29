import { useEffect, useState } from "react"
import { API_URL } from "../config"
import GameCard from "../components/GameCard.jsx"

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/users/wishlist`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setWishlist(data))
      .catch(err => console.error(err))
  }, [token])

  return (
    <div>
      <h1>Your Wishlist</h1>
      <div>
        {wishlist.length > 0
          ? wishlist.map(game => <GameCard key={game._id} game={game} />)
          : <p>No games in your wishlist.</p>
        }
      </div>
    </div>
  )
}
