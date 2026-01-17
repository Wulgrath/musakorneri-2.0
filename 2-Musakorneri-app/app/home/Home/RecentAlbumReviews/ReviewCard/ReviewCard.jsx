import { selectUserById } from "@/app/store/users/selectors/users.selectors";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAlbumById } from "../../../../store/albums/selectors/albums.selectors";
import { selectArtistById } from "../../../../store/artists/selectors/artists.selectors";
import Image from "next/image";
import dayjs from "dayjs";

export const ReviewCard = ({ review }) => {
  const [imageError, setImageError] = useState(false);
  const album = useSelector((state) => selectAlbumById(state, review.albumId));
  const artist = useSelector((state) =>
    selectArtistById(state, review.artistId),
  );
  const user = useSelector((state) => selectUserById(state, review.userId));

  const getDateDisplay = (dateString) => {
    const reviewDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (date1, date2) =>
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();

    if (isSameDay(reviewDate, today)) return "Today";
    if (isSameDay(reviewDate, yesterday)) return "Yesterday";
    return dayjs(reviewDate).format("DD.MM.YYYY");
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700 overflow-hidden relative">
      <div className="absolute top-2 right-2 z-0">
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
          <Image
            src={`https://musakorneri-files.s3.amazonaws.com/album-covers/thumbs/${album?.id}.jpg`}
            alt={`${album?.name || "Unknown Album"} cover`}
            width={96}
            height={96}
            className="object-contain"
            onError={() => setImageError(true)}
          />
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
          {getDateDisplay(review.createdAt)}
        </span>
      </div>
    </div>
  );
};
