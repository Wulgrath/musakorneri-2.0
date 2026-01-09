import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { Artist } from "../../../types";

export const artistsAdapter = createEntityAdapter<Artist>();

const initialState = artistsAdapter.getInitialState();

export const artistsSlice = createSlice({
  name: "artists",
  initialState,
  reducers: {
    setArtists: artistsAdapter.setAll,
    addArtists: artistsAdapter.addMany,
  },
});

export const { setArtists, addArtists } = artistsSlice.actions;
export default artistsSlice.reducer;