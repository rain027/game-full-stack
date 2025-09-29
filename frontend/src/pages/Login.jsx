import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user") // Add role selection
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }) // Include role
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("token", data.token)
        navigate("/")
      } else {
        alert(data.msg || "Login failed")
      }
    } catch (err) {
      console.error(err)
      alert("Login error")
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="developer">Developer</option>
      </select>
      <button type="submit">Login</button>
    </form>
  )
}