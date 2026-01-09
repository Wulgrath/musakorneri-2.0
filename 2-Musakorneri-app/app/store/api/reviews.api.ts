import { api } from "../api";
import { RecentAlbumReviewsResponse, ReviewAlbumRequest } from "../../../types";
import { addAlbums } from "../albums/albumsSlice";
import { addArtists } from "../artists/artistsSlice";
import { addUsers } from "../users/usersSlice";

export const reviewsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<void, ReviewAlbumRequest>({
      query: (reviewData) => ({
        url: "/albums/add-and-review-album",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Album", "Artist", "AlbumReview"],
    }),
    getRecentAlbumReviews: builder.query<RecentAlbumReviewsResponse, void>({
      query: () => "/album-reviews/recent-album-reviews",
      providesTags: ["AlbumReview"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.albums) dispatch(addAlbums(data.albums));
          if (data.artists) dispatch(addArtists(data.artists));
          if (data.users) dispatch(addUsers(data.users));
        } catch {}
      },
    }),
  }),
});

export const { useCreateReviewMutation, useGetRecentAlbumReviewsQuery } =
  reviewsApi;
