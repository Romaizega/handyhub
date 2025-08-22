import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/axios";
import { setCredentials, setUser, clearAuth } from "./authSlice";
import { clearProfile } from "../profiles/profileSlice";
import { getProfile } from "../profiles/profileThunk";


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
      console.log('login', data);
      
      const {accessToken} = data
      dispatch(setCredentials({accessToken}))

      dispatch(clearProfile())
      const me = await api.get('/auth/me')
      dispatch(setUser(me.data))
      await dispatch(getProfile())
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
      dispatch(clearProfile())
      return true
    } catch (error) {
      dispatch(clearAuth())
      dispatch(clearProfile())
      const message = error.response?.data?.message || error.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)

const updateEmail = createAsyncThunk(
  'auth/updateEmail',
  async (email, { rejectWithValue }) => {
    try {
      await api.patch('/users/email', { email })
      return email
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update email');
    }
  }
)

const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      await api.patch('/users/password', { currentPassword, newPassword });
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

 const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.delete('/users/me');
      dispatch(clearAuth());
      dispatch(clearProfile());
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);


export {
  registerUser,
  loginUser, 
  logoutUser,
  updateEmail,
  updatePassword,
  deleteAccount
}