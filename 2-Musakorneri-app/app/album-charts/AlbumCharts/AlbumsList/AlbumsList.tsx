"use client";

import { useSelector } from "react-redux";
import { useGetAlbumChartsDataQuery } from "@/app/store/api/albums.api";
import { RootState } from "@/app/store";
import { orderBy } from "lodash-es";

export const AlbumsList = () => {
  const selectedYear = useSelector(
    (state: RootState) => state.albumCharts.selectedYear
  );
  const { data, isLoading, error } = useGetAlbumChartsDataQuery(selectedYear);

  const albums = data?.albums;
  const sortedAlbums = albums ? orderBy(albums, ["reviewScore"], ["desc"]) : [];
  const artists = data?.artists;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading albums</div>;
  if (!albums) return <div>No albums found</div>;

  return (
    <div className="space-y-4">
      {sortedAlbums.map((album) => {
        const artist = artists?.find((a) => a.id === album.artistId);
        return (
          <div
            key={album.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <div className="flex items-center h-full p-2">
              <img 
                src={`https://musakorneri-files.s3.amazonaws.com/album-covers/thumbs/${album.id}.jpg`}
                alt={`${album.name} cover`}
                className="w-24 h-24 object-contain flex-shrink-0 ml-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex-1 p-4 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {album.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{artist?.name}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Year: {album.year}</span>
                  <span>Score: {album.reviewScore || "N/A"}</span>
                  <span>Reviews: {album.reviewCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
