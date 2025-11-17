import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  error?: string | null;
};

let user: AuthState["user"] = null;
const storedUser = localStorage.getItem("user");
if (storedUser) user = JSON.parse(storedUser);
const token = localStorage.getItem("token");

console.log("STORED: ", { token, user });

const initialState: AuthState = {
  user,
  isAuthenticated: user ? true : false,
  isLoading: false,
  error: null,
  token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", state.token || "");
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem("user");
      // localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder;
    // Handle signupUser and other async thunks similarly...
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice;
