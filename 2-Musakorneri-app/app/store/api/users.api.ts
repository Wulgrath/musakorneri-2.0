import { Album, AlbumReview, AotyItem, User } from "@/types";
import toast from "react-hot-toast";
import { addAlbums } from "../albums/albumsSlice";
import { addAotyItems } from "../aotyItems/aotyItemsSlice";
import { api } from "../api";
import { setCurrentUser } from "../currentUser/currentUserSlice";
import { addUser } from "../users/usersSlice";

interface UserPageData {
  user: User;
  albumReviews: AlbumReview[];
  albums: Album[];
  aotyItems: AotyItem[];
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
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data));
          toast.success("Username updated successfully!");
        } catch {}
      },
    }),
    getUserPageData: builder.query<UserPageData, string>({
      query: (userId: string) => `users/${userId}/get-user-data`,
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(addAlbums(data.albums));
          dispatch(addAotyItems(data.aotyItems));
          dispatch(addUser(data.user));
        } catch {}
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCurrentUserQuery,
  useUpdateUsernameMutation,
  useGetUserPageDataQuery,
} = usersApi;
