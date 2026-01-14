import { api } from "../api";
import { setCurrentUser } from "../currentUser/currentUserSlice";

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
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data));
        } catch {}
      },
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
  overrideExisting: true,
});

export const { useGetCurrentUserQuery, useUpdateUsernameMutation } = usersApi;
