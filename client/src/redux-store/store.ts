import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./features/profile/profileSlice";
import authReducer from "./features/auth/authSlice";
import postReducer from "./features/post/postsSlice";
import commentsReducer from "./features/comments/commentsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    posts: postReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
