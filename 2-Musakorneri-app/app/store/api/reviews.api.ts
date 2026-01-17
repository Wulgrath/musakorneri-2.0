import { api } from "../api";
import {
  RecentAlbumReviewsResponse,
  ReviewAlbumRequest,
  UserAlbumReviewsResponse,
  AlbumReview,
} from "../../../types";
import { addAlbums } from "../albums/albumsSlice";
import { addArtists } from "../artists/artistsSlice";
import { addUsers } from "../users/usersSlice";
import { addReviews, updateReview } from "../reviews/reviewsSlice";
import toast from "react-hot-toast";

export const reviewsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<void, ReviewAlbumRequest>({
      query: (reviewData) => ({
        url: "/albums/add-and-review-album",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Album", "Artist", "AlbumReview"],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast.success("Review submitted successfully!");
        } catch {
          toast.error("Failed to submit review");
        }
      },
    }),
    updateAlbumReview: builder.mutation<
      { albumReview: AlbumReview },
      { albumId: string; score: number }
    >({
      query: ({ albumId, score }) => ({
        url: `/album-reviews/album/${albumId}/update-album-review`,
        method: "PATCH",
        body: { score },
      }),
      invalidatesTags: ["Album", "AlbumReview"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.albumReview) {
            dispatch(
              updateReview({
                id: data.albumReview.id,
                changes: data.albumReview,
              }),
            );
          }
        } catch {}
      },
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
  useUpdateAlbumReviewMutation,
  useGetRecentAlbumReviewsQuery,
  useGetMyAlbumReviewsQuery,
} = reviewsApi;
