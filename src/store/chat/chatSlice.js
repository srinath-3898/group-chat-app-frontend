import {
  addUsers,
  createGroup,
  getChatUsers,
  makeUserAdmin,
  removeAdminAccess,
  removeUser,
} from "./chatActions";

const { createSlice } = require("@reduxjs/toolkit");

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    loading: false,
    chatUsers: null,
    message: null,
    error: null,
  },
  reducers: {
    resetChatData: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
    resetChatUsers: (state) => {
      state.chatUsers = null;
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
    //add users
    builder
      .addCase(addUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload?.data?.message;
      })
      .addCase(addUsers.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
    //get chat users
    builder
      .addCase(getChatUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.chatUsers = payload?.data?.data?.users;
      })
      .addCase(getChatUsers.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
    //make user admin
    builder
      .addCase(makeUserAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(makeUserAdmin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload?.data?.message;
      })
      .addCase(makeUserAdmin.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
    //remove admin access
    builder
      .addCase(removeAdminAccess.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeAdminAccess.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload?.data?.message;
      })
      .addCase(removeAdminAccess.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
    //remove user
    builder
      .addCase(removeUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload?.data?.message;
      })
      .addCase(removeUser.rejected, (state, error) => {
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

export const { resetChatData, resetChatUsers } = chatSlice.actions;
