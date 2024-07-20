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
  selectedUsersMessage: UserState | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  selectedUsersPosts: [],
  selectedUsersSinglePost: null,
  selectedUsersFollowers: [],
  selectedUsersFollowing: [],
  selectedUsersMessage: null,
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
    clearSelecetedUsersData: (state) => {
      state.selectedUser = null;
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
    addSelectedUsersFollower: (
      state,
      action: PayloadAction<FollowersAndFollowingState>
    ) => {
      state.selectedUsersFollowers = [
        action.payload,
        ...state.selectedUsersFollowers,
      ];
    },
    removeSelectedUsersFollower: (state, action: PayloadAction<string>) => {
      state.selectedUsersFollowers = state.selectedUsersFollowers.filter(
        (user) => user.id !== action.payload
      );
    },
    setSelectedUsersMessage: (
      state,
      action: PayloadAction<UserState | null>
    ) => {
      state.selectedUsersMessage = action.payload;
    },
  },
});

export const {
  setUsers,
  setSelectedUser,
  clearSelecetedUsersData,
  setSelectedUsersPosts,
  setSelectedUsersSinglePost,
  setSelectedUsersFollowers,
  setSelectedUsersFollowing,
  addSelectedUsersFollower,
  removeSelectedUsersFollower,
  setSelectedUsersMessage,
} = userSlice.actions;
export default userSlice.reducer;
