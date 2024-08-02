import { createSlice } from "@reduxjs/toolkit";

interface SuggestedUsersState {
  id: string;
  userName: string;
  profilePic: string;
}

export interface SuggestedUsersSliceState {
  suggestedUsers: SuggestedUsersState[];
}

const initialState: SuggestedUsersSliceState = {
  suggestedUsers: [],
};

const suggestedUsersSlice = createSlice({
  name: "suggestedUsers",
  initialState,
  reducers: {
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
  },
});

export const { setSuggestedUsers } = suggestedUsersSlice.actions;

export default suggestedUsersSlice.reducer;
