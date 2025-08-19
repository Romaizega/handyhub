import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/axios";


const getMyOffer = createAsyncThunk(
  'offers/getMyoffer',
  async (id, {rejectWithValue}) => {
    try {
      const {data} = await api.get(`/offers/${id}`)
      console.log("data offer", data);
      return data.offer
      
    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message || "Get offer failed"
      return rejectWithValue({code: status?? 0, message})
    }
  }
)

const getAllOffers = createAsyncThunk(
  'offer/getAllOffers',
  async (_, {rejectWithValue}) => {
    try {
      const {data} = await api.get('/offers/')
      console.log("data offer", data);
      return data.offers
      
    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message || "Get all offers failed"
      return rejectWithValue({code: status?? 0, message})
    }
  }
)

const createOffer = createAsyncThunk(
  'offer/createOffer',
  async ({ job_id, price, message, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/offers', {
        job_id,
        price,
        message,
        status: status ?? 'pending',
      })

      return data.offer
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Creating offer failed'
      let messageFront = message
      if (messageFront.toLowerCase().includes('unique') || messageFront.toLowerCase().includes('duplicate')) {
        messageFront = 'You have already submitted an offer for this job.';
      }
      return rejectWithValue(messageFront)
    }
  }
)


const updateOffer = createAsyncThunk(
  'offer/updateOffer',
  async ({
    id,
    price,
    message,
    status
  }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      if (status) formData.append('status', status);
      if (price != null) formData.append('price', price);

      const { data } = await api.patch(`/offers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return data.offer;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Updating offer failed';
      return rejectWithValue(message);
    }
  }
)

const updateOfferStatus = createAsyncThunk(
  'offer/updateStatus',
  async ({
    id, 
    status,
  }, {rejectWithValue}) =>{
    try {
      const {data} = await api.patch(`/offers/${id}/status/`, {
    status,
    })
    return data.offer
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Updating offer status failed'
      return rejectWithValue(message)
    }
  }
)

const deleteOffer = createAsyncThunk(
  'offers/deleteOffer',
  async({id}, {rejectWithValue}) => {
    try {
      const {data} = await api.delete(`/offers/${id}`)
      return data.id
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Deleting offer failed'
      return rejectWithValue(message)
    }
  }
)

const getOffersByJob = createAsyncThunk(
  'offers/getOfferByJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/offers/by-job/${jobId}`);
      return data.offers;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Get offer by job offer failed'
      return rejectWithValue(message)
    }
  }
)

export {getMyOffer, getAllOffers, createOffer, updateOffer, updateOfferStatus, deleteOffer, getOffersByJob}