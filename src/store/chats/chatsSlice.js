import { getAllChats } from "./chatsActions";

const { createSlice } = require("@reduxjs/toolkit");

const chatsSlice = createSlice({
  name: "chat",
  initialState: {
    loading: false,
    chats: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //get user chats
    builder
      .addCase(getAllChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllChats.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.chats = payload?.data?.data?.chats;
      })
      .addCase(getAllChats.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
  },
});

export default chatsSlice.reducer;

export const {} = chatsSlice.actions;
