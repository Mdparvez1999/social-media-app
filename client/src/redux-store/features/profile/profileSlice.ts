import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ProfileState {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  DOB: string;
  profilePic: string;
  bio: string;
  gender: string;
  isPrivate: boolean;
  isActive: boolean;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  password: string;
}

export interface FollowersAndFollowingState {
  id: string;
  userName: string;
  fullName: string;
  profilePic: string;
}

interface UserInfo {
  id: string;
  username: string;
  profilePic: string;
}

interface FollowRequestState {
  id: string;
  status: string;
  requestedUser: UserInfo;
  receivedUser: UserInfo;
}

export interface ProfileSliceState {
  profile: ProfileState | null;
  followers: FollowersAndFollowingState[];
  following: FollowersAndFollowingState[];
  followRequests: FollowRequestState[];
  sentRequests: FollowRequestState[];
  setSingleSentRequest: FollowRequestState | null;
}

const initialState: ProfileSliceState = {
  profile: null,
  followers: [],
  following: [],
  followRequests: [],
  sentRequests: [],
  setSingleSentRequest: null,
};

const profileSlice = createSlice({
  name: "SET_PROFILE",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      state.profile = action.payload;
    },
    setFollowers: (
      state,
      action: PayloadAction<FollowersAndFollowingState[]>
    ) => {
      state.followers = action.payload;
    },
    setFollowingUsers: (
      state,
      action: PayloadAction<FollowersAndFollowingState[]>
    ) => {
      state.following = action.payload;
    },
    addFollowing: (
      state,
      action: PayloadAction<FollowersAndFollowingState>
    ) => {
      state.following = [action.payload, ...state.following];
    },
    removeFollowing: (state, action: PayloadAction<string>) => {
      state.following = state.following.filter(
        (user) => user?.id !== action.payload
      );
    },

    addFollowers: (
      state,
      action: PayloadAction<FollowersAndFollowingState>
    ) => {
      state.followers = [action.payload, ...state.followers];
    },
    removeFollowers: (state, action: PayloadAction<string>) => {
      state.followers = state.followers.filter(
        (user) => user.id !== action.payload
      );
    },
    updateProfilePic: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.profilePic = action.payload;
      }
    },
    updateFullName: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.fullName = action.payload;
      }
    },
    updateBio: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.bio = action.payload;
      }
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.email = action.payload;
      }
    },
    updateDOB: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.DOB = action.payload;
      }
    },
    updateGender: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.gender = action.payload;
      }
    },
    updatePrivacy: (state, action: PayloadAction<boolean>) => {
      if (state.profile) {
        state.profile.isPrivate = action.payload;
      }
    },
    updateActiveStatus: (state, action: PayloadAction<boolean>) => {
      if (state.profile) {
        state.profile.isActive = action.payload;
      }
    },
    setFollowRequests: (state, action: PayloadAction<FollowRequestState[]>) => {
      state.followRequests = action.payload;
    },
    addFollowRequest: (state, action: PayloadAction<FollowRequestState>) => {
      state.followRequests = [action.payload, ...state.followRequests];
    },
    removeFollowRequest: (state, action: PayloadAction<string>) => {
      state.followRequests = state.followRequests.filter(
        (request) => request.id !== action.payload
      );
    },
    setSentRequests: (state, action: PayloadAction<FollowRequestState[]>) => {
      state.sentRequests = action.payload;
    },
    setSingleSentRequest: (
      state,
      action: PayloadAction<FollowRequestState>
    ) => {
      state.setSingleSentRequest = action.payload;
    },
    addSentRequest: (state, action: PayloadAction<FollowRequestState>) => {
      state.sentRequests = [action.payload, ...state.sentRequests];
    },
    removeSentRequest: (state, action: PayloadAction<string>) => {
      state.sentRequests = state.sentRequests.filter(
        (request) => request.id !== action.payload
      );
    },
  },
});

export const {
  setProfile,
  setFollowers,
  setFollowingUsers,
  addFollowing,
  removeFollowing,
  addFollowers,
  removeFollowers,
  updateProfilePic,
  updateFullName,
  updateBio,
  updateEmail,
  updateDOB,
  updateGender,
  updatePrivacy,
  updateActiveStatus,
  setFollowRequests,
  addFollowRequest,
  removeFollowRequest,
  setSentRequests,
  setSingleSentRequest,
  addSentRequest,
  removeSentRequest,
} = profileSlice.actions;

export default profileSlice.reducer;
