import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/axios";
import { setCredentials, setUser, clearAuth } from "./authSlice";


const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({username, email, password, role}, {rejectWithValue}) => {
    try {
      const {data} = await api.post('/auth/register', {username, email, password, role})
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed'
      return rejectWithValue(message)
    }
  }
)

const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({username, password}, {dispatch, rejectWithValue}) => {
    try {
      const {data} = await api.post('/auth/login', {username, password})
      const {accessToken} = data
      dispatch(setCredentials({accessToken}))
      const me = await api.get('/auth/me')
      dispatch(setUser(me.data))
      return {accessToken}
      
    } catch (error) {
      dispatch(clearAuth())
      const message = error.response?.data?.message || error.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)

const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      await api.post('/auth/logout'), 
      dispatch(clearAuth())
      return true
    } catch (error) {
      dispatch(clearAuth())
      const message = error.response?.data?.message || error.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)

export {registerUser, loginUser, logoutUser}