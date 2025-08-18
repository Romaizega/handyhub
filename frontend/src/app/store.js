import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import profileReducer from '../features/profiles/profileSlice'
import jobReducer from '../features/jobs/jobSlice'
import offerReducer from '../features/offers/offerSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    jobs: jobReducer,
    offers: offerReducer,
  }
})

export default store