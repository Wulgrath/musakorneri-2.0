"use client";

import { useAlbums } from "../../hooks/useAlbums";
import { RecentAlbumReviews } from "./RecentAlbumReviews/RecentAlbumReviews";

export const Home = () => {
  const currentYear = new Date().getFullYear();
  const topAlbumsThisYear = []
    .filter((album) => album.year === currentYear)
    .slice(0, 6);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Welcome to Musakorneri</h1>

      <RecentAlbumReviews />

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Top Albums of {currentYear}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topAlbumsThisYear.length > 0 ? (
            topAlbumsThisYear.map((album) => (
              <div
                key={album.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg">{album.title}</h3>
                <p className="text-gray-600">{album.artist}</p>
                <p className="text-sm text-gray-500">{album.year}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No albums from {currentYear} yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};
