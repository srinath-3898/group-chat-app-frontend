import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import messageReducer from "./message/messageSlice";
import messagesReducer from "./messages/messagesSlice";
import chatReducer from "./chat/chatSlice";
import chatsReducer from "./chats/chatsSlice";
import usersReducer from "./users/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    message: messageReducer,
    messages: messagesReducer,
    chat: chatReducer,
    chats: chatsReducer,
    users: usersReducer,
  },
});

export const wrapper = createWrapper(() => store);
