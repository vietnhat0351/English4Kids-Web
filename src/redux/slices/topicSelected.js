import { createSlice } from "@reduxjs/toolkit";

const topicSelected = createSlice({
    name: "topicSelected",
    initialState: {},
    reducers: {
      setTopicSelected: (state, action) => action.payload,
    },
  });
  
  export const { setTopicSelected } = topicSelected.actions;
  export default topicSelected.reducer;