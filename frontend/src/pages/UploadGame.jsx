import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

export default function UploadGame() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [genre, setGenre] = useState("")
  const [tags, setTags] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const handleUpload = async (e) => {
    e.preventDefault()
    
    // Prepare game data
    const gameData = {
      title,
      price: Number(price),
      description,
      genre,
      tags: tags.split(',').map(tag => tag.trim()),
      media: {
        images: imageUrl ? [imageUrl] : [],
        videos: []
      }
    }

    console.log("Uploading game:", gameData)
    console.log("Token:", token)

    try {
      const res = await fetch(`${API_URL}/developers/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(gameData)
      })
      
      console.log("Response status:", res.status)
      
      // Get response as text first to see what we're getting
      const text = await res.text()
      console.log("Response text:", text)
      
      // Try to parse as JSON
      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        console.error("Could not parse response as JSON:", text)
        alert("Server error: " + text.substring(0, 100))
        return
      }
      
      if (res.ok) {
        alert("Game uploaded successfully!")
        navigate("/developer/dashboard")
      } else {
        alert(data.msg || "Upload failed")
      }
    } catch (err) {
      console.error(err)
      alert("Upload error: " + err.message)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Upload New Game</h1>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Game Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{ padding: '0.5rem' }}
        />
        
        <input 
          type="number" 
          placeholder="Price (e.g., 9.99)" 
          value={price} 
          onChange={e => setPrice(e.target.value)} 
          required 
          step="0.01"
          style={{ padding: '0.5rem' }}
        />
        
        <input 
          type="text" 
          placeholder="Genre (e.g., Action, RPG, Puzzle)" 
          value={genre} 
          onChange={e => setGenre(e.target.value)} 
          style={{ padding: '0.5rem' }}
        />
        
        <input 
          type="text" 
          placeholder="Tags (comma separated: indie, multiplayer, story-rich)" 
          value={tags} 
          onChange={e => setTags(e.target.value)} 
          style={{ padding: '0.5rem' }}
        />
        
        <input 
          type="url" 
          placeholder="Image URL (e.g., https://picsum.photos/400/300)" 
          value={imageUrl} 
          onChange={e => setImageUrl(e.target.value)} 
          style={{ padding: '0.5rem' }}
        />
        
        <textarea 
          placeholder="Game Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          required
          rows={5}
          style={{ padding: '0.5rem' }}
        />
        
        <button 
          type="submit" 
          style={{ 
            padding: '0.75rem', 
            backgroundColor: '#a259ff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }}
        >
          Upload Game
        </button>
      </form>
    </div>
  )
}