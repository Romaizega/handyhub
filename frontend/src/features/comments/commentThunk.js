import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/axios";


const getAllComments = createAsyncThunk(
  'comments/getAllComments',
  async(_, {rejectWithValue}) =>{
    try {
      const {data} = await api.get('/comments')
      console.log("data comments", data);
      return data.comments
    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message || "Get all comments failed"
      return rejectWithValue({code: status?? 0, message})
      
    }
  }
)

const getCommentsByWorkerId = createAsyncThunk(
  'comments/getCommentsByWorkerId',
  async(workerId, {rejectWithValue}) => {
    try {
      const {data} = await api.get(`/comments/profiles/${workerId}/comments`)
      return data.comments
    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message || "Get comments by worker failed"
      return rejectWithValue({code: status?? 0, message})
    }
  }
)

const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ offerId, worker_id, text, rating, photos }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('offerId', offerId);
      formData.append('worker_id', worker_id);
      formData.append('text', text);
      formData.append('rating', rating);

      photos?.forEach((file) => {
        formData.append('photos', file);
      });

      const { data } = await api.post('/comments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return data.comment;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Creating comment failed';
      return rejectWithValue(message);
    }
  }
)

const getCommentByJobId = createAsyncThunk(
  'comments/getCommnetsByJobId',
  async(jobId, [rejectWithValue]) => {
    try {
      const {data} = await api.get(`/comments/job/${jobId}`)
      return data.comments
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Get comments by job failed"
      return rejectWithValue(message)
    }
  }
)

export {
  getAllComments,
  getCommentsByWorkerId,
  createComment,
  getCommentByJobId
}
