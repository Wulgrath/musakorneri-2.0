import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { AlbumReview } from "../../../types";

export const reviewsAdapter = createEntityAdapter<AlbumReview>();

const initialState = reviewsAdapter.getInitialState({
  loading: false,
  error: null as string | null,
});

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews: reviewsAdapter.setAll,
    addReviews: reviewsAdapter.addMany,
  },
  extraReducers: (builder) => {},
});

export const { setReviews, addReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
