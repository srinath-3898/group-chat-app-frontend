import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import messageReducer from "./message/messageSlice";
import messagesReducer from "./messages/messagesSlice";
import chatReducer from "./chat/chatSlice";
import chatsReducer from "./chats/chatsSlice";
import usersReducer from "./users/usersSlice";
import invitationsReducer from "./invitations/invitationsSlice";
import invitationReducer from "./invitation/invitationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    message: messageReducer,
    messages: messagesReducer,
    chat: chatReducer,
    chats: chatsReducer,
    users: usersReducer,
    invitations: invitationsReducer,
    invitation: invitationReducer,
  },
});

export const wrapper = createWrapper(() => store);
