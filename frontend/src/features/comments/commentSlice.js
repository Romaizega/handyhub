import { createSlice } from "@reduxjs/toolkit";
import { AUTH_STATUS } from "../auth/authConstants";

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
  reducers: {}
}
)

export default commentSlice.reducer
