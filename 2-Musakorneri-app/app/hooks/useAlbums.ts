"use client";

import { useGetAlbumsQuery } from "../store/api/albums.api";

export const useAlbums = () => {
  const { data: albums = [], isLoading: loading, error } = useGetAlbumsQuery();

  return {
    albums,
    loading,
    error: error
      ? "message" in error
        ? error.message
        : "An error occurred"
      : null,
  };
};
