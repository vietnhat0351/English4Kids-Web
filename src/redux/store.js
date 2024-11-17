import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import toppicReducer from './slices/topicSlice'
import lessonSlice from './slices/lessonSlice'
import lessonSelectedReducer from './slices/clessonSlice'
import userProcessReducer from './slices/userProcess'
import VocabularyReducer from './slices/vocabularySlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    topics: toppicReducer,
    lessons: lessonSlice,
    lessonSelected: lessonSelectedReducer,
    userProcess: userProcessReducer,
    vocabularies : VocabularyReducer
  },
})

