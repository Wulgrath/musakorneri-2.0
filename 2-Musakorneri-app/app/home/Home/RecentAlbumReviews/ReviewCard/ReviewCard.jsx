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
    <div className="bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-700">
      <h3 className="font-semibold text-lg text-white">
        {album?.name || "Unknown Album"}
      </h3>
      {album?.year && <p className="text-sm text-gray-400">{album.year}</p>}
      <p className="text-gray-300">{artist?.name || "Unknown Artist"}</p>
      <p className="text-sm text-yellow-400 font-medium">
        Score: {review.score}/5
      </p>
      <p className="text-sm text-blue-400">
        Reviewed by: {user?.username || "Unknown User"}
      </p>
    </div>
  );
};
