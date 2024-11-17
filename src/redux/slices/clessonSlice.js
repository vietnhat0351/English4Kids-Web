import { createSlice } from "@reduxjs/toolkit";

const lessonSelectedSlice = createSlice({
  name: "lessonSelected",
  initialState: {},
  reducers: {
    setLessonSelected: (state, action) => action.payload,
  },
});

export const { setLessonSelected } = lessonSelectedSlice.actions;
export default lessonSelectedSlice.reducer;