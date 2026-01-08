import { api } from "../api";

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateUsername: builder.mutation<User, { username: string }>({
      query: ({ username }) => ({
        url: "/users/me/update-username",
        method: "PATCH",
        body: { newUsername: username },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetCurrentUserQuery, useUpdateUsernameMutation } = usersApi;
