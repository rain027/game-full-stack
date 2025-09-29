// Path: src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token") // check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login") // redirect to login after logout
  }

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>Indie Vault</Link>
      <div className={styles.links}>
        {token ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/library">Library</Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <Link to="/developer/dashboard">Developer</Link>
        <Link to="/admin/dashboard">Admin</Link>
      </div>
    </nav>
  )
}
