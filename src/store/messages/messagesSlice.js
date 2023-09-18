import { getAllMessages } from "./messagesActions";

const { createSlice } = require("@reduxjs/toolkit");

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    loading: false,
    messages: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //get user details
    builder
      .addCase(getAllMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMessages.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.messages = payload?.data?.data?.messages;
      })
      .addCase(getAllMessages.rejected, (state, error) => {
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

export const {} = messagesSlice.actions;
