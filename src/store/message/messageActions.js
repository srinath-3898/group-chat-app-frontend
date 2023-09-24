import api from "@/configs/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ chatId, userMessage }, { rejectWithValue }) => {
    console.log(userMessage);
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      const response = await api.post(
        `/message/send-message/${chatId}`,
        userMessage
      );
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);
