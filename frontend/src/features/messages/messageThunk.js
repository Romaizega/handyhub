import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/axios";

export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async ({ currentProfileId, otherProfileId }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/messages/direct?profileId=${currentProfileId}&otherProfileId=${otherProfileId}`
      );
      return data.messages;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ recipientId, text, jobId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/messages/direct", {
        recipientId,
        text,
        ...(jobId ? { jobId } : {}),
      });
      return data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);
