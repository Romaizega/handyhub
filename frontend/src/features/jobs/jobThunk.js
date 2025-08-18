import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/axios";


const getMyJobs = createAsyncThunk(
  'jobs/getMyjob',
  async (_, {rejectWithValue}) => {
    try {
      const {data} = await api.get('/jobs/myjob')
      console.log("data job", data);
      return data.jobs
      
    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message || "Get job failed"
      return rejectWithValue({code: status?? 0, message})
    }
  }
)

const getAllJobs = createAsyncThunk(
  'jobs/getAllJobs',
  async (_, {rejectWithValue}) => {
    try {
      const {data} = await api.get('/jobs')
      console.log("data job", data);
      return data.jobs
      
    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message || "Get all jobs failed"
      return rejectWithValue({code: status?? 0, message})
    }
  }
)

const createJob = createAsyncThunk(
  'job/createJob',
  async ({
    title,
    description,
    photos,   
    status,
    budget,
    due_date
  }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('status', status ?? 'open');
      if (budget != null) formData.append('budget', budget);
      if (due_date) formData.append('due_date', due_date);

      photos?.forEach((file) => {
        formData.append('photos', file);
      });

      const { data } = await api.post('/jobs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return data.job;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Creating job failed';
      return rejectWithValue(message);
    }
  }
);

const updateJob = createAsyncThunk(
  'job/updateJob',
  async ({
    id,
    title,
    description,
    photos,
    existingPhotos = [],
    status,
    budget,
    due_date
  }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (status) formData.append('status', status);
      if (budget != null) formData.append('budget', budget);
      if (due_date) formData.append('due_date', due_date);

      existingPhotos.forEach((photoName) => {
        formData.append('existingPhotos', photoName);
      });

      photos?.forEach((file) => {
        formData.append('photos', file);
      });

      const { data } = await api.patch(`/jobs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return data.job;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Updating job failed';
      return rejectWithValue(message);
    }
  }
)

const updateJobStatus = createAsyncThunk(
  'job/updateStatus',
  async ({
    id, 
    status,
  }, {rejectWithValue}) =>{
    try {
      const {data} = await api.patch(`/jobs/${id}/status/`, {
    status,
    })
    return data.job
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Updating job status failed'
      return rejectWithValue(message)
    }
  }
)

const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async({id}, {rejectWithValue}) => {
    try {
      const {data} = await api.delete(`/jobs/${id}`)
      return data.id
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Deleting job failed'
      return rejectWithValue(message)
    }
  }
)

export {getMyJobs, createJob, updateJob, updateJobStatus, getAllJobs, deleteJob}