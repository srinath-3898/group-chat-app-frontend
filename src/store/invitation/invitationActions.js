import api from "@/configs/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateInvitation = createAsyncThunk(
  "invitation/updateInvitation",
  async ({ status, invitationId }, { rejectWithValue }) => {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      const response = await api.post(
        `/group-invitation/update-status/${invitationId}`,
        { status }
      );
      return response;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(error);
      }
      return rejectWithValue(error.response);
    }
  }
);
