"use client";

import { RootState } from "@/app/store";
import { useGetAlbumChartsDataQuery } from "@/app/store/api/albums.api";
import { selectCurrentUserAlbumReviews } from "@/app/store/reviews/selectors/album-reviews.selectors";
import { orderBy } from "lodash-es";
import { useSelector } from "react-redux";
import { Star, StarBorder, StarHalf } from "@mui/icons-material";

export const AlbumsList = () => {
  const selectedYear = useSelector(
    (state: RootState) => state.albumCharts.selectedYear
  );
  const { data, isLoading, error } = useGetAlbumChartsDataQuery(selectedYear);

  const myAlbumReviews = useSelector(selectCurrentUserAlbumReviews);

  console.log("myAlbumReviews", myAlbumReviews);

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
        const userReview = myAlbumReviews.find(
          (review) => review.albumId === album.id
        );

        return (
          <div
            key={album.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <div className="flex items-center h-full p-2">
              <img
                src={`https://musakorneri-files.s3.amazonaws.com/album-covers/thumbs/${album.id}.jpg`}
                alt={`${album.name} cover`}
                className="w-16 h-16 sm:w-24 sm:h-24 object-contain flex-shrink-0 ml-2"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="flex-1 p-2 sm:p-4 flex flex-col justify-center min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {album.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
                  {artist?.name}
                </p>
                {album.year && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                    {album.year}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span>Score: {album.reviewScore || "N/A"}</span>
                  <span>Reviews: {album.reviewCount || 0}</span>
                </div>
              </div>
              {userReview && (
                <div className="flex flex-col items-center justify-center px-2 sm:px-4 flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm text-center">
                    Your score: {userReview.score}
                  </span>
                  <span className="text-yellow-400 flex">
                    {Array.from({ length: 5 }, (_, i) => {
                      const starValue = i + 1;
                      if (userReview.score >= starValue) {
                        return <Star key={i} sx={{ fontSize: { xs: 16, sm: 20 } }} />;
                      } else if (userReview.score >= starValue - 0.5) {
                        return <StarHalf key={i} sx={{ fontSize: { xs: 16, sm: 20 } }} />;
                      } else {
                        return <StarBorder key={i} sx={{ fontSize: { xs: 16, sm: 20 } }} />;
                      }
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
