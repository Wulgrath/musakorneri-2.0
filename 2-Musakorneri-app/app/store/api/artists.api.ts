import { Album, AlbumReview, Artist } from "@/types";
import { api } from "../api";

interface ArtistData {
  artist: Artist;
  albums: Album[];
  albumReviews: AlbumReview[];
}

export const albumsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getArtistDataById: builder.query<ArtistData, string>({
      query: (artistId: string) => `artists/${artistId}/artist-data`,
      providesTags: (result, error, artistId) => [
        { type: "Artist", id: artistId },
        { type: "Album", id: "LIST" },
      ],
    }),
    // getAlbumById: builder.query<Album, string>({
    //   query: (id) => `/albums/${id}`,
    //   providesTags: (result, error, id) => [{ type: "Album", id }],
    // }),
    // createAlbum: builder.mutation<Album, Partial<Album>>({
    //   query: (album) => ({
    //     url: "/albums",
    //     method: "POST",
    //     body: album,
    //   }),
    //   invalidatesTags: ["Album"],
    // }),
    // getAlbumChartsData: builder.query<AlbumChartsResponse, string>({
    //   query: (year) => `/albums/album-chart-data/${year}`,
    //   providesTags: ["Album", "Artist"],
    //   onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
    //     try {
    //       const { data } = await queryFulfilled;
    //       if (data.artists) dispatch(addArtists(data.artists));
    //     } catch {}
    //   },
    // }),
  }),
});

export const { useGetArtistDataByIdQuery } = albumsApi;
