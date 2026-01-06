"use client";

import { useGetAlbumsQuery } from "../store/api";
import { useDispatch } from "react-redux";
import { setAlbums } from "../store/albums/albumsSlice";
import { useEffect } from "react";

export const useAlbums = () => {
  const dispatch = useDispatch();
  const { data: albums = [], isLoading: loading, error } = useGetAlbumsQuery();

  useEffect(() => {
    if (albums.length > 0) {
      dispatch(setAlbums(albums));
    }
  }, [albums, dispatch]);

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
