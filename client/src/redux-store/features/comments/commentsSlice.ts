import { createSlice } from "@reduxjs/toolkit";

export interface CommentState {
  id: string;
  comment: string;
  commentedAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    userName: string;
    profilePic: string;
  };
}

export interface CommentsState {
  comments: CommentState[];
}

const initialState: CommentsState = {
  comments: [],
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComment: (state, action) => {
      state.comments = action.payload;
    },
    addComment: (state, ation) => {
      state.comments = [ation.payload, ...state.comments];
    },
  },
});

export const { setComment, addComment } = commentSlice.actions;
export default commentSlice.reducer;
