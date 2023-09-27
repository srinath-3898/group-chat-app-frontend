import api from "@/configs/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getInvitations = createAsyncThunk(
  "invitations/getInvitations",
  async (params, { rejectWithValue }) => {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      const response = await api.get("/group-invitation/user-invitations");
      return response;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(error);
      }
      return rejectWithValue(error.response);
    }
  }
);
