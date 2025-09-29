// Path: src/pages/AdminDashboard.jsx
import styles from "./pages.module.css"

// Mock all users and developers
const users = [
  { id: 1, name: "John Doe", role: "User" },
  { id: 2, name: "Jane Smith", role: "Developer" },
]
const games = [
  { id: '1', title: 'Celestial Quest', price: 9.99, rating: 4 },
  { id: '2', title: 'Pixel Dungeon', price: 14.99, rating: 5 },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <h2 className={styles.sectionTitle}>All Users & Developers</h2>
      <div className={styles.table}>
        {users.map(u => (
          <div key={u.id} className={styles.tableRow}>
            <p>{u.name}</p>
            <p>{u.role}</p>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>All Games</h2>
      <div className={styles.table}>
        {games.map(g => (
          <div key={g.id} className={styles.tableRow}>
            <p>{g.title}</p>
            <p>${g.price}</p>
            <p>{g.rating} ⭐</p>
          </div>
        ))}
      </div>
    </div>
  )
}
