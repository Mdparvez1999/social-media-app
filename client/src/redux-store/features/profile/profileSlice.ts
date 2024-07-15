import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

interface FollowersAndFollowingState {
  id: string;
  username: string;
  fullName: string;
  profilePic: string;
}

export interface ProfileSliceState {
  profile: ProfileState | null;
  followers: FollowersAndFollowingState[];
  following: FollowersAndFollowingState[];
}

const initialState = {
  profile: null,
} as ProfileSliceState;

export const fetchProfile = createAsyncThunk<
  ProfileState,
  void,
  { rejectValue: string }
>("profile/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/user/profile", {
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

const profileSlice = createSlice({
  name: "SET_PROFILE",
  initialState,
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
  },
});

export const {
  setFollowers,
  setFollowingUsers,
  updateProfilePic,
  updateFullName,
  updateBio,
  updateEmail,
  updateDOB,
  updateGender,
  updatePrivacy,
  updateActiveStatus,
} = profileSlice.actions;

export default profileSlice.reducer;
