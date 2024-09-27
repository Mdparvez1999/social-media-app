import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostLikes {
  postLikeId: string;
  likedAt: Date;
  postId: string;
  user: {
    id: string;
    profilePic: string;
    userName: string;
  };
}

export interface FeedState {
  id: string;
  caption: string;
  commentCount: number;
  likeCount: number;
  files: string[];
  postlikes: PostLikes[];
  user: {
    id: string;
    profilePic: string;
    userName: string;
  };
  createdAt: Date;
}

interface CommentState {
  id: string;
  comment: string;
  commentedAt: Date;
  post: {
    id: string;
  };
  user: {
    id: string;
    profilePic: string;
    userName: string;
  };
}

export interface FeedSliceState {
  posts: FeedState[];
  singlePost: FeedState | null;
  comments: CommentState[];
  addComment: CommentState | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeedSliceState = {
  posts: [],
  singlePost: null,
  comments: [],
  addComment: null,
  loading: false,
  error: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeedPosts(state, action: PayloadAction<FeedState[]>) {
      state.posts = action.payload;
    },

    setFeedSinglePost(state, action: PayloadAction<FeedState | null>) {
      state.singlePost = action.payload;
    },

    setFeedPostComments(state, action: PayloadAction<CommentState[]>) {
      state.comments = action.payload;
    },

    addCommentToFeedPost(state, action: PayloadAction<CommentState>) {
      state.comments = [action.payload, ...state.comments];
    },
    removeFeedPostComment(state, action: PayloadAction<string>) {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload
      );
    },

    clearFeed(state) {
      state.posts = [];
      state.singlePost = null;
      state.comments = [];
      state.addComment = null;
      state.loading = false;
      state.error = null;
    },

    setSelectedFeedLikes: (state, action: PayloadAction<PostLikes[]>) => {
      if (state.singlePost) {
        state.singlePost.postlikes = action.payload;
        state.singlePost.likeCount = action.payload.length;
      }
    },

    likeSelectedFeedAction: (state, action: PayloadAction<PostLikes>) => {
      if (state.singlePost && state.singlePost.id === action.payload.postId) {
        state.singlePost.postlikes = [
          ...state.singlePost.postlikes,
          action.payload,
        ];
        state.singlePost.likeCount += 1;
      }
    },

    unlikeSelectedFeedAction: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      if (state.singlePost && state.singlePost.id === action.payload.postId) {
        state.singlePost.postlikes = state.singlePost.postlikes.filter(
          (like) => like.user.id !== action.payload.userId
        );
        state.singlePost.likeCount -= 1;
      }
    },
  },
});

export const {
  setFeedPosts,
  setFeedSinglePost,
  setFeedPostComments,
  addCommentToFeedPost,
  removeFeedPostComment,
  clearFeed,
  setSelectedFeedLikes,
  likeSelectedFeedAction,
  unlikeSelectedFeedAction,
} = feedSlice.actions;

export default feedSlice.reducer;
