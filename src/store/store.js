import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import messageReducer from "./message/messageSlice";

export const store = configureStore({
  reducer: { auth: authReducer, user: userReducer, message: messageReducer },
});

export const wrapper = createWrapper(() => store);
