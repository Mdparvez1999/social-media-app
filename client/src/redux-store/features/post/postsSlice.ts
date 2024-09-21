import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface PostLikes {
  postLikeId: string;
  likedAt: Date;
  postId: string;
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
  files: string[];
  postLikes: PostLikes[];
  user: {
    id: string;
    profilePic: string;
    userName: string;
  };
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
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    editPostCaption: (
      state,
      action: PayloadAction<{ id: string | undefined; caption: string }>
    ) => {
      if (state.singlePost && state.singlePost.id === action.payload.id) {
        state.singlePost.caption = action.payload.caption;
      }
    },
    setPostLikes: (state, action: PayloadAction<PostLikes[]>) => {
      if (state.singlePost) {
        state.singlePost.postLikes = action.payload;
      }
    },
    likePostAction: (state, action: PayloadAction<PostLikes>) => {
      if (state.singlePost && state.singlePost.id === action.payload.postId) {
        state.singlePost.postLikes = [
          ...state.singlePost.postLikes,
          action.payload,
        ];
        state.singlePost.likeCount = state.singlePost.likeCount + 1;
      }
    },
    unlikePostAction: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      if (state.singlePost && state.singlePost.id === action.payload.postId) {
        state.singlePost.postLikes = state.singlePost.postLikes?.filter(
          (like) => like.user.id !== action.payload.userId
        );
        state.singlePost.likeCount = state.singlePost.likeCount - 1;
      }
    },
  },
});

export const {
  setPosts,
  setSinglePost,
  deletePost,
  editPostCaption,
  setPostLikes,
  likePostAction,
  unlikePostAction,
} = postSlice.actions;

export default postSlice.reducer;
