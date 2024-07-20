import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./features/profile/profileSlice";
import authReducer from "./features/auth/authSlice";
import postReducer from "./features/post/postsSlice";
import commentsReducer from "./features/comments/commentsSlice";
import notificationsReducer from "./features/notifications/notificationsSlice";
import usersReducer from "./features/users/userSlice";
import feedReducer from "./features/feed/feedSlice";
import messagesReducer from "./features/messages/messagesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    posts: postReducer,
    comments: commentsReducer,
    notifications: notificationsReducer,
    users: usersReducer,
    feed: feedReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
