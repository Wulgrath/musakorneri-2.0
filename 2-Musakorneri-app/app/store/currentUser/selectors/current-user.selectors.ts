import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../index";

const currentUserState = (state: RootState) => state.currentUser;

export const selectCurrentUser = createSelector(
  [currentUserState],
  (state) => state.user
);

export const selectCurrentUserId = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser?.id
);

export const selectCurrentUserLoading = createSelector(
  [currentUserState],
  (state) => state.loading
);

export const selectCurrentUserError = createSelector(
  [currentUserState],
  (state) => state.error
);

export const selectCurrentUserEmail = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser?.email
);

export const selectCurrentUserUsername = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser?.username
);

export const selectIsLoggedIn = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser !== null
);
