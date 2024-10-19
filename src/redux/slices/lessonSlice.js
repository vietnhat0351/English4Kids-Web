import { createSlice } from "@reduxjs/toolkit";

const lessonSlice = createSlice({
  name: "lessons",
  initialState: [],
  reducers: {
    setLessons: (state, action) => action.payload,
  },
});

export const { setLessons } = lessonSlice.actions;
export default lessonSlice.reducer;