import { configureStore } from '@reduxjs/toolkit'
import userProfileReducer from './slices/userSlice'


export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
  },
})