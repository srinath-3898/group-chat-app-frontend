import api from "@/configs/apiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createGroup = createAsyncThunk(
  "chat/createGroup",
  async (group, { rejectWithValue }) => {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      const response = await api.post("/chat/create-group", group);
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);

export const addUsers = createAsyncThunk(
  "chat/add-users",
  async ({ chatId, userIds }, { rejectWithValue }) => {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      const response = await api.post("/chat/add-users", { chatId, userIds });
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);

export const getChatUsers = createAsyncThunk(
  "chat/getChatUsers",
  async ({ chatId }, { rejectWithValue }) => {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      const response = await api.get(`/chat/${chatId}/chat-users`);
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);

export const makeUserAdmin = createAsyncThunk(
  "chat/makeUserAdmin",
  async ({ chatId, userId }, { rejectWithValue }) => {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      const response = await api.post(`/chat/user-admin`, { chatId, userId });
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);

export const removeAdminAccess = createAsyncThunk(
  "chat/removeAdminAccess",
  async ({ chatId, userId }, { rejectWithValue }) => {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      const response = await api.post(`/chat/user-remove-admin`, {
        chatId,
        userId,
      });
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);

export const removeUser = createAsyncThunk(
  "chat/removeUser",
  async ({ chatId, userId }, { rejectWithValue }) => {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      const response = await api.post(`/chat/remove-user`, {
        chatId,
        userId,
      });
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);
