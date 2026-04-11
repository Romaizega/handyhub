import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from './authConstants'
import { 
  registerUser, 
  deleteAccount,
  updateEmail,
  updatePassword
} from "./authThunk";

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
      .addCase(registerUser.pending, (state) => {
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = AUTH_STATUS.SUCCEEDDED
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        if (state.user) state.user.email = action.payload
        state.status = AUTH_STATUS.SUCCEEDDED
      })
      .addCase(updateEmail.rejected, (state, action) => {
        state.error = action.payload
        state.status = AUTH_STATUS.FAILED
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = AUTH_STATUS.SUCCEEDDED
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.error = action.payload
        state.status = AUTH_STATUS.FAILED
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.status = AUTH_STATUS.IDLE
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { setCredentials, setError, setUser, setStatus, clearAuth } = authSlice.actions
export default authSlice.reducer