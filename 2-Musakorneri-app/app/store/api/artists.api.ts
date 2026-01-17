import { Album, AlbumReview, Artist } from "@/types";
import { api } from "../api";
import { addArtists } from "../artists/artistsSlice";

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
    getArtistsBaseData: builder.query<Artist[], void>({
      query: () => `artists/artists-base-data`,
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data) dispatch(addArtists(data));
        } catch {}
      },
    }),
  }),
});

export const { useGetArtistDataByIdQuery, useGetArtistsBaseDataQuery } =
  albumsApi;
