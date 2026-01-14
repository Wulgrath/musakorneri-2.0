import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../../../lib/auth";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface CurrentUserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: CurrentUserState = {
  user: null,
  loading: false,
  error: null,
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      logout();
    },
  },
  extraReducers: (builder) => {},
});

export const { setCurrentUser, clearCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
