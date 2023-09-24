import { createGroup } from "./chatActions";

const { createSlice } = require("@reduxjs/toolkit");

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    loading: false,
    message: null,
    error: null,
  },
  reducers: {
    resetChatData: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //create group
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroup.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload?.data?.message;
      })
      .addCase(createGroup.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
  },
});

export default chatSlice.reducer;

export const { resetChatData } = chatSlice.actions;
