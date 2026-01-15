"use client";

import { RootState } from "@/app/store";
import { useGetAlbumChartsDataQuery } from "@/app/store/api/albums.api";
import { selectCurrentUserAlbumReviews } from "@/app/store/reviews/selectors/album-reviews.selectors";
import { orderBy } from "lodash-es";
import { useSelector } from "react-redux";
import { AlbumsListItem } from "./AlbumsListItem/AlbumsListItem";

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
          <AlbumsListItem
            key={album.id}
            album={album}
            artist={artist}
            userReview={userReview}
          />
        );
      })}
    </div>
  );
};
