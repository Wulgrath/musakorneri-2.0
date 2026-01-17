"use client";

import { selectRecentReleasedAlbums } from "@/app/store/albums/selectors/albums.selectors";
import { selectArtistById } from "@/app/store/artists/selectors/artists.selectors";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Album } from "@/types";
import { RootState } from "@/app/store";

const ReleaseCard = ({ album }: { album: Album }) => {
  const [imageError, setImageError] = useState(false);
  const artist = useSelector((state: RootState) =>
    selectArtistById(state, album.artistId),
  );

  return (
    <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700 overflow-hidden relative">
      {album?.reviewScore && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
          <div className="flex flex-col items-center justify-center bg-gray-700 rounded px-2 py-1">
            <span
              className="text-2xl font-bold"
              style={{
                color: `hsl(${((album.reviewScore - 1) / 4) * 120}, 50%, 45%)`,
              }}
            >
              {album.reviewScore}
            </span>
            <span className="text-xs text-gray-400">
              {album.reviewCount || 0} reviews
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center h-full">
        <div
          className={`w-24 h-24 flex items-center justify-center flex-shrink-0 ml-2 ${
            imageError ? "border border-gray-600" : ""
          }`}
        >
          <Image
            src={`https://musakorneri-files.s3.amazonaws.com/album-covers/thumbs/${album?.id}.jpg`}
            alt={`${album?.name || "Unknown Album"} cover`}
            width={96}
            height={96}
            className="object-contain"
            onError={() => setImageError(true)}
          />
          {imageError && (
            <span className="text-xs text-gray-400 text-center px-1">
              Missing cover art
            </span>
          )}
        </div>
        <div className="flex-1 p-4 pr-20 flex flex-col justify-center">
          <h3 className="font-semibold text-lg text-white">
            {album?.name || "Unknown Album"}
          </h3>
          <p className="text-gray-300">
            <Link
              href={`/artist?id=${artist?.id}`}
              className="hover:text-blue-400 transition-colors"
            >
              {artist?.name || "Unknown Artist"}
            </Link>
          </p>
          {album?.year && <p className="text-sm text-gray-400">{album.year}</p>}
        </div>
      </div>
    </div>
  );
};

export const TopRecentReleases = () => {
  const recentReleases = useSelector(selectRecentReleasedAlbums);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 hidden lg:block">
        Top Recent Releases
      </h2>
      {recentReleases.length > 0 ? (
        <div className="space-y-4">
          {recentReleases.map((release) => (
            <ReleaseCard key={release.id} album={release} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recent releases available.</p>
      )}
    </section>
  );
};
