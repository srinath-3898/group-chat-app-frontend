import { getAllUsers } from "./usersActions";

const { createSlice } = require("@reduxjs/toolkit");

const usersSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    users: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //create group
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload?.data?.data?.users;
      })
      .addCase(getAllUsers.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
  },
});

export default usersSlice.reducer;

export const {} = usersSlice.actions;
