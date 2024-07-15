import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface File {
  id: string;
  fileName: string;
  type: string;
}

interface FeedState {
  id: string;
  caption: string;
  commentCount: number;
  likeCount: number;
  files: File[];
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

export const fetchUserFeed = createAsyncThunk<
  FeedState[],
  void,
  { rejectValue: string }
>("fetchUserFeed", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/users/post/feed", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error(response.statusText);

    const { data } = await response.json();

    if (data.status === "fail" || data.status === "error") {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Something went wrong");
  }
});

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeedSinglePost(state, action: PayloadAction<FeedState | null>) {
      state.singlePost = action.payload;
    },

    setFeedPostComments(state, action: PayloadAction<CommentState[]>) {
      state.comments = action.payload;
    },
    addCommentToFeedPost(state, action: PayloadAction<CommentState>) {
      state.comments = [...state.comments, action.payload];
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUserFeed.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUserFeed.fulfilled,
      (state, action: PayloadAction<FeedState[]>) => {
        state.loading = false;
        state.posts = action.payload;
      }
    );
    builder.addCase(fetchUserFeed.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setFeedSinglePost, setFeedPostComments, addCommentToFeedPost } =
  feedSlice.actions;

export default feedSlice.reducer;
