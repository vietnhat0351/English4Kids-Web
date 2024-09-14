import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfile: null,
};

export const userSliceSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
    },
});

export const { setUserProfile } = userSliceSlice.actions;
export default userSliceSlice.reducer;