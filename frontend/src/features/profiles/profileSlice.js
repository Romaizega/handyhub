import { createSlice } from "@reduxjs/toolkit";
import {AUTH_STATUS} from '../auth/authConstants'
import {getProfile, createNewProfile, updateProfile} from './profileThunk'


const initialState = {
  profile: null,
  status:  AUTH_STATUS.IDLE,
  error: null
}


const profileSlice = createSlice ({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) =>{
      state.profile = null;
      state.status = AUTH_STATUS.IDLE;
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getProfile.pending, (state)=>{
    state.status = AUTH_STATUS.LOADING
    state.error = null
  })
  .addCase(getProfile.fulfilled, (state, action)=>{
    state.status = AUTH_STATUS.SUCCEEDDED
    state.profile = action.payload
  })
  .addCase(getProfile.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload
      })

  .addCase(createNewProfile.pending, (state)=>{
    state.status = AUTH_STATUS.LOADING
    state.error = null
  })
  .addCase(createNewProfile.fulfilled, (state, action)=>{
    state.status = AUTH_STATUS.SUCCEEDDED
    state.profile = action.payload
  })
  .addCase(createNewProfile.rejected, (state, action)=>{
    state.status = AUTH_STATUS.FAILED
    state.error = action.payload || "Failed to create profile"
  })

  .addCase(updateProfile.pending, (state)=>{
    state.status = AUTH_STATUS.LOADING
    state.error = null
  })
  .addCase(updateProfile.fulfilled, (state, action)=>{
    state.status = AUTH_STATUS.SUCCEEDDED
    state.profile = action.payload
  })
  .addCase(updateProfile.rejected, (state, action)=>{
    state.status = AUTH_STATUS.FAILED
    state.error = action.payload || "Failed to create profile"
  })
  }

})

export const {clearProfile} = profileSlice.actions
export default profileSlice.reducer
