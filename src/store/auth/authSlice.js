const { createSlice } = require("@reduxjs/toolkit");
import { signin, signup } from "./authActions";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    token: null,
    userDetails: null,
    message: null,
    error: null,
  },
  reducers: {
    resetSigninAndSignupData: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //user signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload?.data?.message;
      })
      .addCase(signup.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });

    //user signin
    builder
      .addCase(signin.pending, (state) => {
        state.loading = true;
      })
      .addCase(signin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload?.data?.data?.token;
        state.userDetails = payload?.data?.data?.user;
        state.message = payload?.data?.message;
      })
      .addCase(signin.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
  },
});

export default authSlice.reducer;

export const { resetSigninAndSignupData } = authSlice.actions;
