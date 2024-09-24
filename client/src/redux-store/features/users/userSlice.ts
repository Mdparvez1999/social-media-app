import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostLikes, PostState } from "../post/postsSlice";

export interface UserState {
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
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface FollowersAndFollowingState {
  id: string;
  userName: string;
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
        (user) => user?.id !== action.payload
      );
    },
    addSelectedUsersFollowing: (
      state,
      action: PayloadAction<FollowersAndFollowingState>
    ) => {
      state.selectedUsersFollowing = [
        action.payload,
        ...state.selectedUsersFollowing,
      ];
    },
    removeSelectedUsersFollowing: (state, action: PayloadAction<string>) => {
      state.selectedUsersFollowing = state.selectedUsersFollowing.filter(
        (user) => user.id !== action.payload
      );
    },
    setSelectedUsersMessage: (
      state,
      action: PayloadAction<UserState | null>
    ) => {
      state.selectedUsersMessage = action.payload;
    },
    setSelectedPostLikes: (state, action: PayloadAction<PostLikes[]>) => {
      if (state.selectedUsersSinglePost) {
        state.selectedUsersSinglePost.postLikes = action.payload;
      }
    },
    likeSelectedPostAction: (state, action: PayloadAction<PostLikes>) => {
      if (
        state.selectedUsersSinglePost &&
        state.selectedUsersSinglePost.id === action.payload.postId
      ) {
        state.selectedUsersSinglePost.postLikes = [
          ...state.selectedUsersSinglePost.postLikes,
          action.payload,
        ];
        state.selectedUsersSinglePost.likeCount =
          state.selectedUsersSinglePost.likeCount + 1;
      }
    },
    unlikeSelectedPostAction: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      if (
        state.selectedUsersSinglePost &&
        state.selectedUsersSinglePost.id === action.payload.postId
      ) {
        state.selectedUsersSinglePost.postLikes =
          state.selectedUsersSinglePost.postLikes.filter(
            (like) => like.user.id !== action.payload.userId
          );
        state.selectedUsersSinglePost.likeCount =
          state.selectedUsersSinglePost.likeCount - 1;
      }
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
  addSelectedUsersFollowing,
  removeSelectedUsersFollowing,
  setSelectedUsersMessage,
  setSelectedPostLikes,
  likeSelectedPostAction,
  unlikeSelectedPostAction,
} = userSlice.actions;
export default userSlice.reducer;
