import { createSelector } from "@reduxjs/toolkit";
import { orderBy } from "lodash-es";
import { RootState } from "../../index";
import { albumsAdapter } from "../albumsSlice";
import dayjs from "dayjs";
import { Album } from "@/types";

// Get the selectors from the adapter
const adapterSelectors = albumsAdapter.getSelectors(
  (state: RootState) => state.albums,
);

// Export the basic selectors
export const selectAllAlbums = adapterSelectors.selectAll;
export const selectAlbumById = adapterSelectors.selectById;
export const selectAlbumIds = adapterSelectors.selectIds;
export const selectAlbumEntities = adapterSelectors.selectEntities;
export const selectAlbumTotal = adapterSelectors.selectTotal;

export const selectRecentReleasedAlbums = createSelector(
  [selectAllAlbums],
  (albums) => {
    const threeMonthsAgo = dayjs().subtract(3, "month").format("YYYY-MM-DD");

    const recentAlbums = albums.filter(
      (album: Album) => album.releaseDate >= threeMonthsAgo,
    );

    return orderBy(recentAlbums, "reviewScore", "desc");
  },
);
