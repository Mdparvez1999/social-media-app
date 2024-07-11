import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
    updateProfilePic: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.profilePic = action.payload;
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
  },
});

export const { updateProfilePic, updateBio, updateEmail } =
  profileSlice.actions;

export default profileSlice.reducer;
