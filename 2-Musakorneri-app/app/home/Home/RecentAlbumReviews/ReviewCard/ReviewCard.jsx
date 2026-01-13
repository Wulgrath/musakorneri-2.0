import { useSelector } from "react-redux";
import { selectAlbumById } from "../../../../store/albums/selectors/albums.selectors";
import { selectArtistById } from "../../../../store/artists/selectors/artists.selectors";
import { selectUserById } from "@/app/store/users/selectors/users.selectors";

export const ReviewCard = ({ review }) => {
  const album = useSelector((state) => selectAlbumById(state, review.albumId));
  const artist = useSelector((state) =>
    selectArtistById(state, review.artistId)
  );
  const user = useSelector((state) => selectUserById(state, review.userId));

  return (
    <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700 overflow-hidden">
      <div className="flex h-full">
        <img
          src={`https://musakorneri-files.s3.amazonaws.com/album-covers/thumbs/${album?.id}.jpg`}
          alt={`${album?.name || "Unknown Album"} cover`}
          className="w-24 h-full object-contain flex-shrink-0 ml-2"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="flex-1 p-4 flex flex-col justify-center">
          <h3 className="font-semibold text-lg text-white">
            {album?.name || "Unknown Album"}
          </h3>

          <p className="text-gray-300">{artist?.name || "Unknown Artist"}</p>
          {album?.year && <p className="text-sm text-gray-400">{album.year}</p>}
          <p className="text-sm text-yellow-400 font-medium">
            Score: {review.score}/5
          </p>
          <p className="text-sm">
            <span className="text-blue-400">
              Reviewed by: {user?.username || "Unknown User"}
            </span>
            <span className="text-gray-500">
              {" "}
              • {new Date(review.createdAt).toLocaleDateString("en-GB")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
