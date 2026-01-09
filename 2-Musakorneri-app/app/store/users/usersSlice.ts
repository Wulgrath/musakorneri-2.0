import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { User } from "../../../types";

export const usersAdapter = createEntityAdapter<User>();

const initialState = usersAdapter.getInitialState();

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: usersAdapter.setAll,
    addUsers: usersAdapter.addMany,
  },
});

export const { setUsers, addUsers } = usersSlice.actions;
export default usersSlice.reducer;
