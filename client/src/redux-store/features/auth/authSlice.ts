import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  id: string;
  userName: string;
  isActive: boolean;
}

export interface AuthState {
  currentUser: AuthUser | null;
}

const initialState: AuthState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.currentUser = action.payload;
      if (action.payload)
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
    },
    logoutCurrentUser: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { setCurrentUser, logoutCurrentUser } = authSlice.actions;
export default authSlice.reducer;
