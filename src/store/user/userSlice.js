import { editUserDetails, getUserDetails, getUsers } from "./userActions";

const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    userDetails: null,
    users: null,
    message: null,
    error: null,
  },
  reducers: {
    resetUserData: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
    setUserDetails: (state, { payload }) => {
      state.userDetails = payload;
    },
  },
  extraReducers: (builder) => {
    //get user details
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userDetails = payload?.data?.data?.userDetails;
      })
      .addCase(getUserDetails.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });

    //edit user details
    builder
      .addCase(editUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(editUserDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userDetails = payload?.data?.data?.userDetails;
        state.message = payload?.data?.message;
      })
      .addCase(editUserDetails.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });

    //get users
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload?.data?.data?.users;
      })
      .addCase(getUsers.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
  },
});

export default userSlice.reducer;

export const { resetUserData, setUserDetails } = userSlice.actions;
