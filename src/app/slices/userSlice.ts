import { createSlice } from "@reduxjs/toolkit";

export type UserData = {
    id: Number | null,
    access_token: string | null,
    refresh_token: string | null,
}

const initialState: UserData = {
    id: null,
    access_token: null,
    refresh_token: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state: UserData, action) => {
            state.id = action.payload.id
            state.access_token = action.payload.access_token
            state.refresh_token = action.payload.refresh_token
        },
        logout: (state) => {
            state.id = null
            state.access_token = null
            state.refresh_token = null
        },
        updateTokens: (state, action) => {
            state.access_token = action.payload.access
            state.refresh_token = action.payload.refresh
        }
    }
})

export const { 
    login, logout, updateTokens
} = userSlice.actions;

export const selectUser = (state: {user: UserData}) => state.user;
export default userSlice.reducer;