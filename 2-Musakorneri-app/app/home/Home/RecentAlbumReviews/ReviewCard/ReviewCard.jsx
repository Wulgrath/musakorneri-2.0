import { selectUserById } from "@/app/store/users/selectors/users.selectors";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAlbumById } from "../../../../store/albums/selectors/albums.selectors";
import { selectArtistById } from "../../../../store/artists/selectors/artists.selectors";

export const ReviewCard = ({ review }) => {
  const [imageError, setImageError] = useState(false);
  const album = useSelector((state) => selectAlbumById(state, review.albumId));
  const artist = useSelector((state) =>
    selectArtistById(state, review.artistId),
  );
  const user = useSelector((state) => selectUserById(state, review.userId));

  return (
    <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700 overflow-hidden relative">
      <div className="absolute top-2 right-2 z-10">
        <div className="flex items-center justify-center bg-gray-700 rounded w-16 h-12">
          <span
            className="text-2xl font-bold"
            style={{
              color: `hsl(${((review.score - 1) / 4) * 120}, 50%, 45%)`,
            }}
          >
            {review.score}
          </span>
        </div>
      </div>
      <div className="flex items-center h-full">
        <div
          className={`w-24 h-24 flex items-center justify-center flex-shrink-0 ml-2 ${
            imageError ? "border border-gray-600" : ""
          }`}
        >
          <img
            src={`https://musakorneri-files.s3.amazonaws.com/album-covers/thumbs/${album?.id}.jpg`}
            alt={`${album?.name || "Unknown Album"} cover`}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              setImageError(true);
            }}
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
      <div className="absolute bottom-2 right-2">
        <span className="text-sm text-gray-400">
          {user?.username || "Unknown User"} •{" "}
          {new Date(review.createdAt).toLocaleDateString("en-GB")}
        </span>
      </div>
    </div>
  );
};
