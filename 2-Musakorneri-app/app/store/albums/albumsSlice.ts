import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Album } from "../api";

const albumsAdapter = createEntityAdapter<Album>();

interface AlbumsState {
  loading: boolean;
  error: string | null;
}

const initialState = albumsAdapter.getInitialState<AlbumsState>({
  loading: false,
  error: null,
});

export const albumsSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {
    setAlbums: albumsAdapter.setAll,
    addAlbum: albumsAdapter.addOne,
    updateAlbum: albumsAdapter.updateOne,
    removeAlbum: albumsAdapter.removeOne,
    removeAllAlbums: albumsAdapter.removeAll,
  },
});

export const {
  setAlbums,
  addAlbum,
  updateAlbum,
  removeAlbum,
  removeAllAlbums,
} = albumsSlice.actions;

export { albumsAdapter };

export default albumsSlice.reducer;
