import { api } from '../api'

export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
}

export const albumsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAlbums: builder.query<Album[], void>({
      query: () => '/albums',
      providesTags: ['Album'],
    }),
    getAlbumById: builder.query<Album, string>({
      query: (id) => `/albums/${id}`,
      providesTags: (result, error, id) => [{ type: 'Album', id }],
    }),
    createAlbum: builder.mutation<Album, Partial<Album>>({
      query: (album) => ({
        url: '/albums',
        method: 'POST',
        body: album,
      }),
      invalidatesTags: ['Album'],
    }),
  }),
})

export const {
  useGetAlbumsQuery,
  useGetAlbumByIdQuery,
  useCreateAlbumMutation,
} = albumsApi