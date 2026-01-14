import { api } from "../api";
import {
  RecentAlbumReviewsResponse,
  ReviewAlbumRequest,
  UserAlbumReviewsResponse,
} from "../../../types";
import { addAlbums } from "../albums/albumsSlice";
import { addArtists } from "../artists/artistsSlice";
import { addUsers } from "../users/usersSlice";
import { addReviews } from "../reviews/reviewsSlice";

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
    getUserAlbumReviews: builder.query<UserAlbumReviewsResponse, void>({
      query: (userId) => `/album-reviews/user/${userId}/get-user-reviews`,
      providesTags: ["AlbumReview"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.reviews) dispatch(addReviews(data.reviews));
        } catch {}
      },
    }),
    getMyAlbumReviews: builder.query({
      query: () => "/album-reviews/my-album-reviews",
      providesTags: ["AlbumReview"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(addReviews(data.albumReviews));
        } catch {}
      },
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetRecentAlbumReviewsQuery,
  useGetMyAlbumReviewsQuery,
} = reviewsApi;
