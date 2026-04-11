import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from './authConstants'


const initialState = {
  user: null,
  accessToken: null,
  status: AUTH_STATUS.IDLE,
  error: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.status = 'idle'
      state.error = null
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('auth/registerUser/pending', (state) => {
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase('auth/registerUser/fulfilled', (state) => {
        state.status = AUTH_STATUS.SUCCEEDDED
      })
      .addCase('auth/registerUser/rejected', (state, action) => {
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload
      })
      .addCase('auth/updateEmail/fulfilled', (state, action) => {
        if (state.user) state.user.email = action.payload
        state.status = AUTH_STATUS.SUCCEEDDED
      })
      .addCase('auth/updateEmail/rejected', (state, action) => {
        state.error = action.payload
        state.status = AUTH_STATUS.FAILED
      })
      .addCase('auth/updatePassword/fulfilled', (state) => {
        state.status = AUTH_STATUS.SUCCEEDDED
      })
      .addCase('auth/updatePassword/rejected', (state, action) => {
        state.error = action.payload
        state.status = AUTH_STATUS.FAILED
      })
      .addCase('auth/deleteAccount/fulfilled', (state) => {
        state.user = null
        state.accessToken = null
        state.status = AUTH_STATUS.IDLE
      })
      .addCase('auth/deleteAccount/rejected', (state, action) => {
        state.error = action.payload
      })
  }
})

export const { setCredentials, setError, setUser, setStatus, clearAuth } = authSlice.actions
export default authSlice.reducer