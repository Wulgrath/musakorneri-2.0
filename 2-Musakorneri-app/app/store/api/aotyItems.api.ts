import toast from "react-hot-toast";
import { AotyItem } from "../../../types";
import { setAotyItem } from "../aotyItems/aotyItemsSlice";
import { api } from "../api";

export const aotyItemsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    setAlbumAsAoty: builder.mutation<AotyItem, string>({
      query: (albumId) => ({
        url: "/album-reviews/aoty/set-album-as-aoty",
        method: "POST",
        body: { albumId },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          const { data } = await queryFulfilled;

          if (data) {
            dispatch(setAotyItem(data));
          }

          toast.success("Album set as AOTY successfully!");
        } catch {
          toast.error("Failed to set AOTY");
        }
      },
    }),
  }),
});

export const { useSetAlbumAsAotyMutation } = aotyItemsApi;
