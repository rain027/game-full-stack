import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("token", data.token)
        navigate("/")
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  )
}
