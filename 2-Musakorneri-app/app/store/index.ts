import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import currentUserReducer from "./currentUser/currentUserSlice";
import albumsReducer from "./albums/albumsSlice";
import artistsReducer from "./artists/artistsSlice";
import usersReducer from "./users/usersSlice";
import albumChartsReducer from "./albumCharts/albumChartsSlice";
import reviewsReducer from "./reviews/reviewsSlice";
import aotyItemsReducer from "./aotyItems/aotyItemsSlice";

import { notificationMiddleware } from "./middleware/notification.middleware";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    currentUser: currentUserReducer,
    albums: albumsReducer,
    artists: artistsReducer,
    users: usersReducer,
    albumCharts: albumChartsReducer,
    reviews: reviewsReducer,
    aotyItems: aotyItemsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(notificationMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
