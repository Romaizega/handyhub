import { createSlice } from "@reduxjs/toolkit";
import {AUTH_STATUS} from './authConstants'
import { 
  registerUser, 
  loginUser,
  deleteAccount,
  updateEmail,
  updatePassword
 } from "./authThunk";
import { getProfile } from "../profiles/profileThunk";

const initialState = {
  user: null,
  accessToken: null,
  status: AUTH_STATUS.IDLE,
  error: null
}


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
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
    setStatus: (state, action) =>{
      state.status = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },

    
    extraReducers: (builder) => {
      builder
        .addCase(registerUser.pending, (state)=>{
          state.status = AUTH_STATUS.LOADING
          state.error = null
        })
        .addCase(registerUser.fulfilled, (state)=>{
          state.status = AUTH_STATUS.SUCCEEDDED
        })
        .addCase(registerUser.rejected, (state, action)=>{
          state.status = AUTH_STATUS.FAILED
          state.error = action.payload
        })
  
        .addCase(loginUser.pending, (state) => {
          state.status = AUTH_STATUS.LOADING
          state.error = null
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.status = AUTH_STATUS.SUCCEEDDED;
          state.user = {
            ...action.payload,
            profile: action.payload.profile || null, 
          };
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.status = AUTH_STATUS.FAILED
          state.error = action.payload
        })

        .addCase(getProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user.profile = action.payload ?? null
        }
        })
        .addCase(updateEmail.fulfilled, (state, action) => {
          if (state.user) state.user.email = action.payload;
          state.status = AUTH_STATUS.SUCCEEDDED;
        })
        .addCase(updateEmail.rejected, (state, action) => {
          state.error = action.payload;
          state.status = AUTH_STATUS.FAILED;
        })

        .addCase(updatePassword.fulfilled, (state) => {
          state.status = AUTH_STATUS.SUCCEEDDED;
        })
        .addCase(updatePassword.rejected, (state, action) => {
          state.error = action.payload;
          state.status = AUTH_STATUS.FAILED;
        })

        .addCase(deleteAccount.fulfilled, (state) => {
          state.user = null;
          state.accessToken = null;
          state.status = AUTH_STATUS.IDLE;
        })
        .addCase(deleteAccount.rejected, (state, action) => {
          state.error = action.payload;
  });
    }
  }
}) 

export const {setCredentials, setError, setUser, setStatus, clearAuth} = authSlice.actions
export default authSlice.reducer