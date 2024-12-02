import { createSlice } from "@reduxjs/toolkit";

const userProcessSlice = createSlice({
  name: "listUser",
  initialState: [],
  reducers: {
    setUserProcess: (state, action) => action.payload,
  },
});

export const { setUserProcess } = userProcessSlice.actions;
export default userProcessSlice.reducer;