import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserProfile: (state, action) => {
            state.profile = action.payload;
        },
        clearUser: (state) => {
            state.currentUser = null;
        },
    },
});

export const { setUserProfile , clearUser} = userSlice.actions;
export default userSlice.reducer;