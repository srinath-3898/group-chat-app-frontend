import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import authReducer from "./auth/authSlice";

export const store = configureStore({ reducer: { auth: authReducer } });

export const wrapper = createWrapper(() => store);
