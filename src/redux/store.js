import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import toppicReducer from './slices/topicSlice'
import topicSelectedReducer from './slices/topicSelected'


export const store = configureStore({
  reducer: {
    user: userReducer,
    topics: toppicReducer,
    topicSelected: topicSelectedReducer,
  },
})

