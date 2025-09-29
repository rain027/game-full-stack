// Path: src/App.jsx
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Home from "./pages/Home.jsx"
import GameDetails from "./pages/GameDetails.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Wishlist from "./pages/Wishlist.jsx"
import Cart from "./pages/Cart.jsx"
import Library from "./pages/Library.jsx"
import DeveloperDashboard from "./pages/DeveloperDashboard.jsx"
import UploadGame from "./pages/UploadGame.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"

function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem 2rem" }}>
        <Routes>
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/game/:gameId" element={<ProtectedRoute><GameDetails /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/developer/dashboard" element={<ProtectedRoute><DeveloperDashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadGame /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  )
}

export default App
