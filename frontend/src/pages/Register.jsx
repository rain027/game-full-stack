import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("token", data.token)
        navigate("/")
      } else {
        alert(data.msg || "Registration failed")
      }
    } catch (err) {
      console.error(err)
      alert("Registration error")
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="developer">Developer</option>
      </select>
      <button type="submit">Register</button>
    </form>
  )
}