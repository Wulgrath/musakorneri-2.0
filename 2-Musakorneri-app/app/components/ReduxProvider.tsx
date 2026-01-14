"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import { useGetCurrentUserQuery } from "../store/api/users.api";
import { useGetMyAlbumReviewsQuery } from "../store/api/reviews.api";

function AppInitializer({ children }: { children: React.ReactNode }) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useGetCurrentUserQuery(undefined, { skip: !token });
  useGetMyAlbumReviewsQuery(undefined, { skip: !token });

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
}
