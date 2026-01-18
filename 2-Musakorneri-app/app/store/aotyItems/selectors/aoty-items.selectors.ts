import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { aotyItemsAdapter } from "../aotyItemsSlice";
import { selectCurrentUserId } from "../../currentUser/selectors/current-user.selectors";

// Get the selectors from the adapter
const adapterSelectors = aotyItemsAdapter.getSelectors(
  (state: RootState) => state.aotyItems,
);

// Export the basic selectors
export const selectAllAotyItems = adapterSelectors.selectAll;
export const selectAotyItemById = adapterSelectors.selectById;
export const selectAotyItemIds = adapterSelectors.selectIds;
export const selectAotyItemEntities = adapterSelectors.selectEntities;
export const selectAotyItemTotal = adapterSelectors.selectTotal;

export const selectCurrentUserAotyItems = createSelector(
  [selectAllAotyItems, selectCurrentUserId],
  (aotyItems, currentUserId) =>
    aotyItems.filter((aotyItem) => aotyItem.userId === currentUserId),
);

export const selectAotyItemsByUserId = createSelector(
  [selectAllAotyItems, (state: RootState, userId: string | null) => userId],
  (aotyItems, userId) =>
    userId ? aotyItems.filter((aotyItem) => aotyItem.userId === userId) : [],
);
