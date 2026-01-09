import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser } from "../../../lib/api";
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

// Async thunk for fetching current user
export const fetchCurrentUser = createAsyncThunk(
  'currentUser/fetchCurrentUser',
  async () => {
    const userData = await getCurrentUser();
    return userData;
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});

export const { setCurrentUser, clearCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
