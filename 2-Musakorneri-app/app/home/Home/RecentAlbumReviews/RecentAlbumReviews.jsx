"use client";

export const RecentAlbumReviews = () => {
  const recentAlbums = [];

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Recent Albums Reviewed</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentAlbums.map((album) => (
          <div
            key={album.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-lg">{album.title}</h3>
            <p className="text-gray-600">{album.artist}</p>
            {album.year && (
              <p className="text-sm text-gray-500">{album.year}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
