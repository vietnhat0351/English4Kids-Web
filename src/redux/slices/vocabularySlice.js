import { createSlice } from "@reduxjs/toolkit";

const vocabularySilce = createSlice({
  name: "topics",
  initialState: [],
  reducers: {
    setVocabularies: (state, action) => action.payload,
  },
});

export const { setVocabularies } = vocabularySilce.actions;
export default vocabularySilce.reducer;