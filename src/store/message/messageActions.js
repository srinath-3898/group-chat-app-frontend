import api from "@/configs/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ chatId, userMessage, fileData = null }, { rejectWithValue }) => {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      let payload;
      if (fileData) {
        fileData.append("type", userMessage.type);
        payload = fileData;
      } else {
        payload = userMessage;
      }
      const response = await api.post(
        `/message/send-message/${chatId}`,
        payload
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
