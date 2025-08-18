import { createSlice } from "@reduxjs/toolkit";
import { getAllJobs,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus } from "./jobThunk";
import { AUTH_STATUS } from "../auth/authConstants";

const initialState = {
  jobs: [],
  myjobs: [],
  currentJob: null,
  status: AUTH_STATUS.IDLE,
  error: null,
}

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllJobs.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDDED;
        state.jobs = action.payload;
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.myjobs = action.payload;
      })
      .addCase(createJob.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(createJob.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED
        state.jobs = action.payload
      })
      .addCase(createJob.rejected, (state, action)=>{
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload || "Failed to create job"
      })

      .addCase(updateJob.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(updateJob.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED
        state.jobs = action.payload
      })
      .addCase(updateJob.rejected, (state, action)=>{
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload || "Failed to update job"
      })

      .addCase(updateJobStatus.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(updateJobStatus.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED
        state.jobs = action.payload
      })
      .addCase(updateJobStatus.rejected, (state, action)=>{
        state.jobs = AUTH_STATUS.FAILED
        state.error = action.payload || "Failed to update job status"
      })

      .addCase(deleteJob.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(deleteJob.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED
        state.jobs = state.jobs.filter(job => job.id !== action.payload)
      })
      .addCase(deleteJob.rejected, (state, action)=>{
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload || "Failed to deletig job status"
      })
  },
})

export const { clearCurrentJob } = jobSlice.actions
export default jobSlice.reducer
