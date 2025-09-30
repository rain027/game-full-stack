import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { API_URL } from "../config"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a1d 0%, #2d1b4e 100%)',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#1a1a1d',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(162, 89, 255, 0.3)',
        maxWidth: '450px',
        width: '100%',
        border: '1px solid rgba(162, 89, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #a259ff 0%, #ff6b9d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#aaa', fontSize: '1rem' }}>
            Login to continue your indie game journey
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Email Input */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#ddd',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ 
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: '10px',
                border: '2px solid #333',
                backgroundColor: '#0d0d0f',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#a259ff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          {/* Password Input */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#ddd',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ 
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: '10px',
                border: '2px solid #333',
                backgroundColor: '#0d0d0f',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#a259ff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#ddd',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Login As
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem' 
            }}>
              <button
                type="button"
                onClick={() => setRole('user')}
                style={{
                  padding: '0.9rem',
                  borderRadius: '10px',
                  border: `2px solid ${role === 'user' ? '#a259ff' : '#333'}`,
                  backgroundColor: role === 'user' ? 'rgba(162, 89, 255, 0.2)' : '#0d0d0f',
                  color: role === 'user' ? '#a259ff' : '#aaa',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                👤 User
              </button>
              <button
                type="button"
                onClick={() => setRole('developer')}
                style={{
                  padding: '0.9rem',
                  borderRadius: '10px',
                  border: `2px solid ${role === 'developer' ? '#a259ff' : '#333'}`,
                  backgroundColor: role === 'developer' ? 'rgba(162, 89, 255, 0.2)' : '#0d0d0f',
                  color: role === 'developer' ? '#a259ff' : '#aaa',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                👨‍💻 Developer
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              padding: '1rem',
              borderRadius: '10px',
              border: 'none',
              background: loading 
                ? '#666' 
                : 'linear-gradient(135deg, #a259ff 0%, #ff6b9d 100%)',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              marginTop: '0.5rem',
              boxShadow: loading ? 'none' : '0 10px 30px rgba(162, 89, 255, 0.4)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 15px 40px rgba(162, 89, 255, 0.6)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 10px 30px rgba(162, 89, 255, 0.4)'
              }
            }}
          >
            {loading ? '🔄 Logging in...' : '🚀 Login'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid #333'
        }}>
          <p style={{ color: '#aaa', fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Link 
              to="/register"
              style={{ 
                color: '#a259ff', 
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ff6b9d'}
              onMouseLeave={(e) => e.target.style.color = '#a259ff'}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}