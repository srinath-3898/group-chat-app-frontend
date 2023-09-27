import { getInvitations } from "./invitationsActions";

const { createSlice } = require("@reduxjs/toolkit");

const invitationsSlice = createSlice({
  name: "invitations",
  initialState: {
    loading: false,
    invitations: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInvitations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvitations.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.invitations = payload?.data?.data?.invitations;
      })
      .addCase(getInvitations.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
  },
});

export default invitationsSlice.reducer;

export const {} = invitationsSlice.actions;
