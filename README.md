================================================================================
                          INDIE VAULT - README
                    Indie Game Marketplace Platform
================================================================================

PROJECT OVERVIEW
----------------
Indie Vault is a full-stack web application for discovering, purchasing, and 
managing indie games. Built with MongoDB, Express.js, React, and Node.js (MERN).


FEATURES
--------
For Users:
- Browse indie games with ratings and images
- Add games to wishlist and shopping cart
- Purchase games securely
- Access purchased games in library
- Rate games (1-5 stars) after purchase

For Developers:
- Upload new games with details and images
- Manage uploaded games via dashboard
- View game statistics (ratings, reviews, sales)
- Delete games (protected if already purchased)


TECH STACK
----------
Backend:
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Bcrypt for password hashing

Frontend:
- React 19 with Vite
- React Router for navigation
- Redux Toolkit for state management
- Tailwind CSS for styling


PREREQUISITES
-------------
- Node.js (v18+)
- MongoDB (local or Atlas cloud)
- npm or yarn package manager


INSTALLATION
------------

1. Clone the repository:
   git clone https://github.com/rain027/game-full-stack.git
   cd game-full-stack

2. Install backend dependencies:
   cd backend
   npm install

3. Install frontend dependencies:
   cd ../frontend
   npm install


CONFIGURATION
-------------

Backend (.env file in backend folder):
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/indievault
   JWT_SECRET=your_secret_key_here

Frontend (src/config.js):
   export const API_URL = "http://localhost:3001/api"


RUNNING THE APPLICATION
-----------------------

1. Start MongoDB (if using local):
   mongod

2. Start backend server (in backend folder):
   npm run dev
   
   Should show:
   ✅ Server running on http://localhost:3001
   ✅ MongoDB connected

3. Start frontend (in frontend folder, new terminal):
   npm run dev
   
   Opens at: http://localhost:5173


PROJECT STRUCTURE
-----------------
game-full-stack/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── redux/       # State management
    │   └── config.js    # API configuration
    └── package.json


API ENDPOINTS
-------------
Authentication:
  POST /api/auth/register    - Register new user/developer
  POST /api/auth/login       - Login

Games:
  GET    /api/games          - Get all games
  GET    /api/games/:id      - Get game details
  POST   /api/games          - Create game (developer only)
  DELETE /api/games/:id      - Delete game (developer only)
  POST   /api/games/:id/rate - Rate game (user only)

Developer:
  GET  /api/developers/mygames  - Get developer's games
  POST /api/developers/upload   - Upload new game

User - Wishlist:
  GET    /api/users/wishlist         - Get wishlist
  POST   /api/users/wishlist/:gameId - Add to wishlist
  DELETE /api/users/wishlist/:gameId - Remove from wishlist

User - Cart:
  GET    /api/users/cart         - Get cart
  POST   /api/users/cart/:gameId - Add to cart
  DELETE /api/users/cart/:gameId - Remove from cart

User - Library:
  GET  /api/users/library   - Get purchased games
  POST /api/users/purchase  - Purchase cart items


USER ROLES
----------
User:
- Browse and purchase games
- Manage wishlist and cart
- Rate purchased games
- Access game library

Developer:
- Upload and manage games
- View game statistics
- Delete unpurchased games
- Cannot purchase games


TESTING
-------
Test as User:
1. Register with role "User"
   Email: user@test.com / Password: password123
2. Browse games on home page
3. Add game to cart
4. Purchase game
5. Check library
6. Rate purchased game

Test as Developer:
1. Register with role "Developer"
   Email: dev@test.com / Password: password123
2. Go to "Upload Game"
3. Fill in game details and upload
4. View in "My Games" dashboard
5. Try deleting unpurchased game (works)
6. Purchase as user, then try deleting (blocked)


KEY FEATURES
------------
Purchase Protection:
- Developers cannot delete games that users have purchased
- Protects user access to bought content

Rating System:
- Only owners can rate games
- Average rating calculated automatically
- Shows star rating and review count

Role-Based Access:
- Different navigation for users vs developers
- Separate dashboards and features
- JWT token stores user role


TROUBLESHOOTING
---------------
Port 5000 in use:
  Solution: Changed to port 3001 in .env file

MongoDB connection failed:
  Solution: Start mongod or use MongoDB Atlas

CORS errors:
  Solution: Check config.js has correct API URL

Module import errors:
  Solution: Use ES6 imports (import/export) not require


SECURITY
--------
- JWT authentication with token expiry
- Password hashing with bcrypt
- Role-based access control
- Purchase protection logic
- CORS enabled for frontend
- Environment variables for secrets


COMMON ISSUES
-------------
Q: Can't login after registration?
A: Check role selection matches registration

Q: Games not showing?
A: Check MongoDB connection and backend console

Q: Delete not working?
A: Check if game was purchased by any user

Q: Cart/Wishlist showing for developer?
A: Logout and login again to refresh token


PROJECT NOTES
-------------
- Backend runs on port 3001 (not 5000 due to Windows conflict)
- Frontend runs on port 5173 (Vite default)
- MongoDB database name: indievault
- JWT tokens expire in 7 days
- All routes use ES6 modules (import/export)


FUTURE ENHANCEMENTS
-------------------
- Payment gateway integration
- Email notifications
- Admin dashboard
- Advanced search filters
- User profiles
- Game reviews with text
- Social features
- Discount system


AUTHOR
------
GitHub: @rain027
Repository: https://github.com/rain027/game-full-stack


LICENSE
-------
MIT License


CREDITS
-------
Built with React, Node.js, Express, and MongoDB
Icons from React Icons
Styling with Tailwind CSS


================================================================================
                        END OF README
================================================================================
