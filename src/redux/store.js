import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import toppicReducer from './slices/topicSlice'
import topicSelectedReducer from './slices/topicSelected'
import lessonSlice from './slices/lessonSlice'
import clessonReducer from './slices/clessonSlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    topics: toppicReducer,
    topicSelected: topicSelectedReducer,
    lessons: lessonSlice,
    clesson: clessonReducer
  },
})

