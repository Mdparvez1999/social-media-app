import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { ProfileState } from "../..";

interface ProfileState {
  id: string;
  userName: string;
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

export interface ProfileSliceState {
  profile: ProfileState | null;
}

const initialState = {
  profile: null,
} as ProfileSliceState;

const profileSlice = createSlice({
  name: "SET_PROFILE",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
