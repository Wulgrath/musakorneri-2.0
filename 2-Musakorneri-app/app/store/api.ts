import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'YOUR_API_GATEWAY_URL_HERE',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAlbums: builder.query<Album[], void>({
      query: () => '/albums',
    }),
  }),
})

export const { useGetAlbumsQuery } = api