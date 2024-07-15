import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  userName: string;
  profilePic: string;
}

interface SelectedUserState {
  id: string;
  userName: string;
  fullName: string;
  profilePic: string;
  bio: string;
  isPrivate: boolean;
  isActive: boolean;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

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
  user: {
    id: string;
    profilePic: string;
    userName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface FollowersAndFollowingState {
  id: string;
  username: string;
  fullName: string;
  profilePic: string;
}

export interface UsersState {
  users: UserState[];
  selectedUser: SelectedUserState | null;
  selectedUsersPosts: PostState[];
  selectedUsersSinglePost: PostState | null;
  selectedUsersFollowers: FollowersAndFollowingState[];
  selectedUsersFollowing: FollowersAndFollowingState[];
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  selectedUsersPosts: [],
  selectedUsersSinglePost: null,
  selectedUsersFollowers: [],
  selectedUsersFollowing: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserState[]>) => {
      state.users = action.payload;
    },
    setSelectedUser: (
      state,
      action: PayloadAction<SelectedUserState | null>
    ) => {
      state.selectedUser = action.payload;
    },
    setSelectedUsersPosts: (state, action: PayloadAction<PostState[]>) => {
      state.selectedUsersPosts = action.payload;
    },
    setSelectedUsersSinglePost: (
      state,
      action: PayloadAction<PostState | null>
    ) => {
      state.selectedUsersSinglePost = action.payload;
    },
    setSelectedUsersFollowers: (
      state,
      action: PayloadAction<FollowersAndFollowingState[]>
    ) => {
      state.selectedUsersFollowers = action.payload;
    },
    setSelectedUsersFollowing: (
      state,
      action: PayloadAction<FollowersAndFollowingState[]>
    ) => {
      state.selectedUsersFollowing = action.payload;
    },
  },
});

export const {
  setUsers,
  setSelectedUser,
  setSelectedUsersPosts,
  setSelectedUsersSinglePost,
  setSelectedUsersFollowers,
  setSelectedUsersFollowing,
} = userSlice.actions;
export default userSlice.reducer;
