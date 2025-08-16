import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export type UserType = {
  id: string;
  name: string;
  email: string;
};

interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading?: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",  // Changed from "user" to "auth" for better semantics
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        user: UserType | null;
        accessToken: string | null;
        refreshToken: string | null;
      }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;
      
      // Set cookies when user is set
      if (action.payload.accessToken) {
        Cookies.set("accessToken", action.payload.accessToken, { expires: 1 }); // Expires in 1 day
      }
      if (action.payload.refreshToken) {
        Cookies.set("refreshToken", action.payload.refreshToken, { expires: 7 }); // Expires in 7 days
      }
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      if (action.payload) {
        Cookies.set("accessToken", action.payload, { expires: 1 });
      } else {
        Cookies.remove("accessToken");
      }
    },
    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload;
      if (action.payload) {
        Cookies.set("refreshToken", action.payload, { expires: 7 });
      } else {
        Cookies.remove("refreshToken");
      }
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    logout(state) {
      // Clear state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      
      // Clear all auth cookies
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("roll");
      
      // Clear all cookies (alternative approach)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    },
  },
});

export const {
  setUser,
  setAccessToken,
  setRefreshToken,
  setIsLoading,
  logout,
} = authSlice.actions;

export default authSlice.reducer;