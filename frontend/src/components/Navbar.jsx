// Path: src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [userRole, setUserRole] = useState(null)

  // Decode token to get user role
  useEffect(() => {
    if (token) {
      try {
        // JWT tokens have 3 parts separated by dots
        const payload = token.split('.')[1]
        const decoded = JSON.parse(atob(payload))
        setUserRole(decoded.role)
        console.log("User role from token:", decoded.role) // Debug log
      } catch (err) {
        console.error("Error decoding token:", err)
      }
    } else {
      setUserRole(null)
    }
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUserRole(null)
    navigate("/login")
  }

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>Indie Vault</Link>
      <div className={styles.links}>
        {token ? (
          <>
            <Link to="/">Home</Link>
            
            {/* User-only links */}
            {userRole === 'user' && (
              <>
                <Link to="/cart">Cart</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/library">Library</Link>
              </>
            )}
            
            {/* Developer-only links */}
            {userRole === 'developer' && (
              <>
                <Link to="/developer/dashboard">My Games</Link>
                <Link to="/upload">Upload Game</Link>
              </>
            )}
            
            {/* Admin link - for future use */}
            {userRole === 'admin' && (
              <Link to="/admin/dashboard">Admin</Link>
            )}
            
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}