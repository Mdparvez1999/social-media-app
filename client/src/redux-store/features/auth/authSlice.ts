import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  id: string;
  userName: string;
  isActive: boolean;
}

export interface AuthState {
  currentUser: AuthUser | null;
  token: string | null;
  expirationTime: number | null;
}

const initialState: AuthState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),
  token: localStorage.getItem("token") || null, // Ensure this is null if not found
  expirationTime: Number(localStorage.getItem("expirationTime")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
        expirationTime: number;
      }>
    ) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.expirationTime = action.payload.expirationTime;

      if (action.payload) {
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
        localStorage.setItem("token", state.token || "null");
        localStorage.setItem(
          "expirationTime",
          JSON.stringify(state.expirationTime)
        );
      }
    },
    logoutCurrentUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.expirationTime = null;
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { setCurrentUser, logoutCurrentUser } = authSlice.actions;
export default authSlice.reducer;
