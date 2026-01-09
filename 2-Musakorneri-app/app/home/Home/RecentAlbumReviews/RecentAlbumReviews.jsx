"use client";

import { useSelector } from "react-redux";
import { useGetRecentAlbumReviewsQuery } from "../../../store/api/reviews.api";
import { selectAlbumById } from "@/app/store/albums/selectors/albums.selectors";
import { selectArtistById } from "@/app/store/artists/selectors/artists.selectors";

export const RecentAlbumReviews = () => {
  const { data, isLoading, error } = useGetRecentAlbumReviewsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading recent reviews</div>;

  const albumReviews = data?.albumReviews || [];

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Recent Albums Reviewed</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albumReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};

const ReviewCard = ({ review }) => {
  const album = useSelector((state) => selectAlbumById(state, review.albumId));
  const artist = useSelector((state) =>
    selectArtistById(state, review.artistId)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-lg">
        {album?.name || "Unknown Album"}
      </h3>
      <p className="text-gray-600">{artist?.name || "Unknown Artist"}</p>
      <p className="text-sm text-gray-500">Score: {review.score}/5</p>
      {album?.year && <p className="text-sm text-gray-500">{album.year}</p>}
    </div>
  );
};
