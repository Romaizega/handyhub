import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import profileReducer from '../features/profiles/profileSlice'
import jobReducer from '../features/jobs/jobSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    jobs: jobReducer,
  }
})

export default store