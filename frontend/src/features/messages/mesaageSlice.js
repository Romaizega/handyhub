import { createSlice } from "@reduxjs/toolkit";
import { getMessages, sendMessage } from "./messageThunk";

export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
};

const initialState = {
  byPeer: {},         
  statusByPeer: {},   
  errorByPeer: {},   
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearThread: (state, action) => {
      const peerId = String(action.payload);
      delete state.byPeer[peerId];
      delete state.statusByPeer[peerId];
      delete state.errorByPeer[peerId];
    },
    clearAll: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getMessages.pending, (state, action) => {
        const { otherProfileId } = action.meta.arg;
        const key = String(otherProfileId);
        state.statusByPeer[key] = STATUS.LOADING;
        state.errorByPeer[key] = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        const { otherProfileId } = action.meta.arg;
        const key = String(otherProfileId);
        state.statusByPeer[key] = STATUS.SUCCEEDED;
        state.byPeer[key] = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        const { otherProfileId } = action.meta.arg;
        const key = String(otherProfileId);
        state.statusByPeer[key] = STATUS.FAILED;
        state.errorByPeer[key] = action.payload || "Failed to load messages";
      })
      // SEND
      .addCase(sendMessage.pending, (state, action) => {
        const { recipientId } = action.meta.arg;
        const key = String(recipientId);
        state.statusByPeer[key] = STATUS.LOADING;
        state.errorByPeer[key] = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { recipientId } = action.meta.arg;
        const key = String(recipientId);
        state.statusByPeer[key] = STATUS.SUCCEEDED;
        if (!state.byPeer[key]) state.byPeer[key] = [];
        state.byPeer[key].push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        const { recipientId } = action.meta.arg;
        const key = String(recipientId);
        state.statusByPeer[key] = STATUS.FAILED;
        state.errorByPeer[key] = action.payload || "Failed to send message";
      });
  },
});

export const { clearThread, clearAll } = messageSlice.actions;
export default messageSlice.reducer;
