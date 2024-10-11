import { createSlice } from "@reduxjs/toolkit";

const topicSlice = createSlice({
  name: "topics",
  initialState: [],
  reducers: {
    setTopics: (state, action) => action.payload,
  },
});

export const { setTopics } = topicSlice.actions;
export default topicSlice.reducer;