import { Album, AlbumChartsResponse } from "@/types";
import { api } from "../api";
import { addArtists } from "../artists/artistsSlice";

export const albumsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAlbums: builder.query<Album[], void>({
      query: () => "/albums",
      providesTags: ["Album"],
    }),
    getAlbumById: builder.query<Album, string>({
      query: (id) => `/albums/${id}`,
      providesTags: (result, error, id) => [{ type: "Album", id }],
    }),
    createAlbum: builder.mutation<Album, Partial<Album>>({
      query: (album) => ({
        url: "/albums",
        method: "POST",
        body: album,
      }),
      invalidatesTags: ["Album"],
    }),
    getAlbumChartsData: builder.query<AlbumChartsResponse, string>({
      query: (year) => `/albums/album-chart-data/${year}`,
      providesTags: ["Album", "Artist"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.artists) dispatch(addArtists(data.artists));
        } catch {}
      },
    }),
  }),
});

export const {
  useGetAlbumsQuery,
  useGetAlbumByIdQuery,
  useCreateAlbumMutation,
  useGetAlbumChartsDataQuery,
} = albumsApi;
