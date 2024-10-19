import { createSlice } from "@reduxjs/toolkit";

const clessonSlice = createSlice({
  name: "clesson",
  initialState: {},
  reducers: {
    setCLesson: (state, action) => action.payload,
  },
});

export const { setCLesson } = clessonSlice.actions;
export default clessonSlice.reducer;