import { createSlice } from "@reduxjs/toolkit";
import * as status from "../constants/status";
import { loadUserFromCookie, login } from "../../service/authUser";
import Cookies from 'js-cookie'


const authSlice = createSlice({
    name: "auth",
    initialState: {
        status: status.IDLE,
        data: null,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload; // Update state with user info
            state.status = status.SUCCESSFULLY; // Set status to successfully
        },
        //remove cookies
        logout: (state) => {
            Cookies.remove("token");
            state.data = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            state.status = status.PENDING;
        })

        .addCase(login.fulfilled, (state, action) => {
            state.status = status.SUCCESSFULLY;
            state.data = action.payload;
        })

        .addCase(login.rejected, (state, action) => {
            state.status = status.FAILED;
            state.error = action.error.message;
        })

        .addCase(loadUserFromCookie.fulfilled, (state, action) => {
            state.data = action.payload;
        })//chỉ riêng trường hợp 
    },
});
export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;