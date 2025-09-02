import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from "../auth/authConstants";
import { 
  getAllComments,
  getCommentsByWorkerId,
  createComment
 } from "./commentThunk";

const initialState = {
  comments: [],
  mycomments: [],
  currentComment: null,
  status: AUTH_STATUS.IDLE,
  error: null,
}

const commentSlice = createSlice( {
  name: "comments",
  initialState,
  reducers: {
    clearCurrentComment: (state) => {
      state.currentComment = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllComments.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING;
        state.error = null
      })
      .addCase(getAllComments.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED;
        state.comments = action.payload
      })
      .addCase(getAllComments.rejected, (state, action)=>{
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload
      })
      .addCase(getCommentsByWorkerId.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING;
        state.error = null
      })
      .addCase(getCommentsByWorkerId.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED;
        state.comments = action.payload
      })
      .addCase(getCommentsByWorkerId.rejected, (state, action)=>{
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload
      })
      .addCase(createComment.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(createComment.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED
        state.comments = action.payload
      })
      .addCase(createComment.rejected, (state, action)=>{
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload || "Failed to create comment"
      })
  }
}
)

export default commentSlice.reducer
