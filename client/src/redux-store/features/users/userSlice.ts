import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  userName: string;
  profilePic: string;
}

export interface UsersState {
  users: UserState[];
  selectedUser: UserState | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserState[]>) => {
      state.users = action.payload;
    },
    selectedUser: (state, action: PayloadAction<UserState | null>) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
