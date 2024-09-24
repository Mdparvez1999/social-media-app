import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  id: string;
  userName: string;
  isActive: boolean;
}

export interface AuthState {
  currentUser: AuthUser | null;
  token: string | null;
}

const initialState: AuthState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),
  token: localStorage.getItem("token") || "null",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      if (action.payload) {
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
        localStorage.setItem("token", state.token || "null");
      }
    },
    logoutCurrentUser: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { setCurrentUser, logoutCurrentUser } = authSlice.actions;
export default authSlice.reducer;
