import { RootState } from "../../index";
import { artistsAdapter } from "../artistsSlice";

// Get the selectors from the adapter
const adapterSelectors = artistsAdapter.getSelectors(
  (state: RootState) => state.artists
);

// Export the basic selectors
export const selectAllArtists = adapterSelectors.selectAll;
export const selectArtistById = adapterSelectors.selectById;
export const selectArtistIds = adapterSelectors.selectIds;
export const selectArtistEntities = adapterSelectors.selectEntities;
export const selectArtistTotal = adapterSelectors.selectTotal;
