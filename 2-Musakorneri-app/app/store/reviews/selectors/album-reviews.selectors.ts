import { createSelector } from "@reduxjs/toolkit";
import { selectCurrentUserId } from "../../currentUser/selectors/current-user.selectors";
import { RootState } from "../../index";
import { reviewsAdapter } from "../reviewsSlice";

// Get the selectors from the adapter
const adapterSelectors = reviewsAdapter.getSelectors(
  (state: RootState) => state.reviews,
);

// Export the basic selectors
export const selectAllAlbumReviews = adapterSelectors.selectAll;
export const selectAlbumById = adapterSelectors.selectById;
export const selectAlbumIds = adapterSelectors.selectIds;
export const selectAlbumEntities = adapterSelectors.selectEntities;
export const selectAlbumTotal = adapterSelectors.selectTotal;

export const selectCurrentUserAlbumReviews = createSelector(
  [selectAllAlbumReviews, selectCurrentUserId],
  (albumReviews, currentUserId) => {
    return albumReviews.filter((review) => review.userId === currentUserId);
  },
);
