import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { Album } from "../../../types";

export const albumsAdapter = createEntityAdapter<Album>();

const initialState = albumsAdapter.getInitialState();

export const albumsSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {
    setAlbums: albumsAdapter.setAll,
    addAlbums: albumsAdapter.addMany,
  },
});

export const { setAlbums, addAlbums } = albumsSlice.actions;
export default albumsSlice.reducer;