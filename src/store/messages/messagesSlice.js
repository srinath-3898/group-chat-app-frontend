import { getChatMessages } from "./messagesActions";

const { createSlice } = require("@reduxjs/toolkit");

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    loading: false,
    messages: null,
    error: null,
  },
  reducers: {
    resetMessagesData: (state) => {
      state.loading = false;
      state.messages = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //get all messages
    builder
      .addCase(getChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatMessages.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.messages = payload?.data?.data;
      })
      .addCase(getChatMessages.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
  },
});

export default messagesSlice.reducer;

export const { resetMessagesData } = messagesSlice.actions;
