// Path: src/redux/store.js
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice.js"
import cartReducer from "./slices/cartSlice.js"

export default configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
})
