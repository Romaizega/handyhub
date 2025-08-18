import { createSlice } from "@reduxjs/toolkit";
import {AUTH_STATUS} from '../auth/authConstants'
import { getMyOffer,
  getAllOffers,
  createOffer,
  updateOffer,
  updateOfferStatus,
  getOffersByJob,
  deleteOffer} from './offerThunk'


const initialState = {
  offers: [],
  myoffers: [],
  currentOffer: null,
  status: AUTH_STATUS.IDLE,
  error: null,
}


const offerSlice = createSlice ({
  name: "offers",
  initialState,
  reducers: {
    clearOffer: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOffers.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getAllOffers.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDDED;
        state.offers = action.payload;
      })
      .addCase(getAllOffers.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.error = action.payload;
      })

      .addCase(getMyOffer.fulfilled, (state, action) => {
        state.myoffers = action.payload;
      })

      .addCase(createOffer.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(createOffer.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED
        state.offers = action.payload
      })
      .addCase(createOffer.rejected, (state, action)=>{
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload || "Failed to create offer"
      })

      .addCase(updateOffer.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(updateOffer.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED
        state.offers = action.payload
      })
      .addCase(updateOffer.rejected, (state, action)=>{
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload || "Failed to update offer"
      })

      .addCase(updateOfferStatus.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(updateOfferStatus.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED
        state.offers = action.payload
      })
      .addCase(updateOfferStatus.rejected, (state, action)=>{
        state.offers = AUTH_STATUS.FAILED
        state.error = action.payload || "Failed to update offer status"
      })

      .addCase(deleteOffer.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(deleteOffer.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED
        state.offers = state.offers.filter(offer => offer.id !== action.payload)
      })
      .addCase(deleteOffer.rejected, (state, action)=>{
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload || "Failed to deletig offer status"
      })

      .addCase(getOffersByJob.pending, (state)=>{
        state.status = AUTH_STATUS.LOADING
        state.error = null
      })
      .addCase(getOffersByJob.fulfilled, (state, action)=>{
        state.status = AUTH_STATUS.SUCCEEDDED
        state.offers = action.payload
      })
      .addCase(getOffersByJob.rejected, (state, action)=>{
        state.status = AUTH_STATUS.FAILED
        state.error = action.payload || "Failed to get offer by job status"
      })
  },
})

export const {clearOffer} = offerSlice.actions
export default offerSlice.reducer

