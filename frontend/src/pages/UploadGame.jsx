import { useState } from "react"
import { API_URL } from "../config"

export default function UploadGame() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const token = localStorage.getItem("token")

  const handleUpload = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/developers/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, price, description })
      })
      const data = await res.json()
      if (res.ok) alert("Game uploaded successfully!")
      else alert(data.message)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleUpload}>
      <input type="text" placeholder="Game Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit">Upload Game</button>
    </form>
  )
}
