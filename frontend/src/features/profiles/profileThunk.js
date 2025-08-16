import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/axios";


const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, {rejectWithValue}) => {
    try {
      const {data} = await api.get('/profiles/me')
      console.log("data profile", data);
      return data.profile
      
    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message || "Get profile failed"
      return rejectWithValue({code: status?? 0, message})
    }
  }
)

const createNewProfile = createAsyncThunk(
  'profile/createProfile',
  async ({  
    display_name,
    city,
    about,
    avatar_url,
    skills,
    hourly_rate
  }, {rejectWithValue}) =>{
    try {
      const {data} = await api.post('/profiles/create', {
    display_name,
    city,
    about,
    avatar_url,
    skills,
    hourly_rate
    })
    return data.profile
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Creating profile failed'
      return rejectWithValue(message)
    }
  }
)

const updateProfile = createAsyncThunk(
  'profile/updateprofile',
   async ({  
    display_name,
    city,
    about,
    avatar_url,
    skills,
    hourly_rate
  }, {rejectWithValue}) =>{
    try {
      const {data} = await api.patch('/profiles/update', {
        display_name,
        city,
        about,
        avatar_url,
        skills,
        hourly_rate
    })
    return data.profile
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Updating profile failed'
      return rejectWithValue(message)
    }
  }
)

export {getProfile, createNewProfile, updateProfile}
