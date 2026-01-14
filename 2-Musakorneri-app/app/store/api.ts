import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshToken } from "../../lib/auth";
import { isTokenExpired } from "../../lib/token-utils";
import { setReviews } from "./reviews/reviewsSlice";
import { setCurrentUser } from "./currentUser/currentUserSlice";

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let token = localStorage.getItem("accessToken");

  if (token && isTokenExpired(token)) {
    try {
      const refreshResult = await refreshToken();
      token = refreshResult?.AuthenticationResult?.AccessToken || null;

      if (!token) {
        window.location.href = "/login";
        return { error: { status: 401, data: "Authentication failed" } };
      }
    } catch (error) {
      window.location.href = "/login";
      return { error: { status: 401, data: "Authentication failed" } };
    }
  }

  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "YOUR_API_GATEWAY_URL_HERE",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await refreshToken();

    if (refreshResult?.AuthenticationResult?.AccessToken) {
      token = refreshResult.AuthenticationResult.AccessToken;

      const retryQuery = fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "YOUR_API_GATEWAY_URL_HERE",
        prepareHeaders: (headers) => {
          headers.set("Content-Type", "application/json");
          headers.set("Accept", "application/json");
          headers.set("Authorization", `Bearer ${token}`);
          return headers;
        },
      });

      result = await retryQuery(args, api, extraOptions);
    } else {
      window.location.href = "/login";
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Album", "User", "Artist", "AlbumReview"],
  endpoints: () => ({}),
});

