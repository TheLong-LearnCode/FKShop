import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import cartSlice from "../slices/cartSlice";
const store = configureStore({
    reducer: {
        auth: authSlice,
        cart: cartSlice,
    },
});

export default store;