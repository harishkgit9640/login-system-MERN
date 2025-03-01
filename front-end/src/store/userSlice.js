import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        allUser: [], // ✅ Default to an empty array to prevent `.map()` errors
    },
    reducers: {
        addAllUser: (state, action) => {
            state.allUser = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure it's always an array
        },
        addCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        removeUser: (state) => {
            state.currentUser = null; // ✅ Fix: Clear `currentUser`, not `user`
            state.allUser = []; // ✅ Optionally clear `allUser`
        },
    },
});

export const { addCurrentUser, addAllUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
