import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface File {
  id: string;
  fileName: string;
  type: string;
}

interface PostLikes {
  id: string;
  isLiked: boolean;
  liked_at: Date;
  post: string;
  user: {
    id: string;
    profilePic: string;
    userName: string;
  };
}

export interface PostState {
  id: string;
  caption: string;
  commentCount: number;
  likeCount: number;
  files: File[];
  postlikes: PostLikes[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CombinedPostSliceState {
  posts: PostState[];
  singlePost: PostState | null;
}

const initialState: CombinedPostSliceState = {
  posts: [],
  singlePost: null,
};

const postSlice = createSlice({
  name: "POST",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<PostState[]>) => {
      state.posts = action.payload;
    },
    setSinglePost: (state, action: PayloadAction<PostState | null>) => {
      state.singlePost = action.payload;
    },
    deletePost: (state, acction: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== acction.payload);
    },
  },
});

export const { setPosts, setSinglePost, deletePost } = postSlice.actions;

export default postSlice.reducer;
