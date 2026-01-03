"use client";

import { useAlbums } from "../../hooks/useAlbums";

export const Home = () => {
  const { albums, loading, error } = useAlbums();

  if (loading) return <div>Loading albums...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("ALBUMS", albums);

  return (
    <div>
      <h1>Welcome to Home!!</h1>
      <div>
        {albums.map((album) => (
          <div key={album.id}>
            <h3>{album.title}</h3>
            <p>{album.artist}</p>
            {album.year && <p>{album.year}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
