import { configureStore } from "@reduxjs/toolkit";
import {persistStore, persistReducer} from 'redux-persist'
import authReducer from '../features/auth/authSlice'
import profileReducer from '../features/profiles/profileSlice'
import jobReducer from '../features/jobs/jobSlice'
import offerReducer from '../features/offers/offerSlice'
import messageRudercer from '../features/messages/mesaageSlice'
import commentReducer from '../features/comments/commentSlice'
import storage from 'redux-persist/lib/storage';

// Configure global Redux store with feature slices
const authPersistConfig = {
  key: 'auth',
  storage,
}

const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    profile: profileReducer,
    jobs: jobReducer,
    offers: offerReducer,
    messages: messageRudercer,
    comments: commentReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({serializableCheck: false})
})

export const persistor = persistStore(store)
export default store