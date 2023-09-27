import { updateInvitation } from "./invitationActions";

const { createSlice } = require("@reduxjs/toolkit");

const invitationSlice = createSlice({
  name: "invitations",
  initialState: {
    loading: false,
    message: null,
    error: null,
  },
  reducers: {
    resetInvitationData: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateInvitation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInvitation.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload?.data?.message;
      })
      .addCase(updateInvitation.rejected, (state, error) => {
        state.loading = false;
        if (error?.payload) {
          state.error = error?.payload?.data?.message;
        } else {
          state.error = error?.error?.message;
        }
      });
  },
});

export default invitationSlice.reducer;

export const { resetInvitationData } = invitationSlice.actions;
