import api from "@/configs/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signup = createAsyncThunk(
  "auth/signup",
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", userDetails);
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signin", userDetails);
      localStorage.setItem("token", response.data?.data?.token);
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);
export const signout = createAsyncThunk(
  "auth/signout",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/signout");
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);
