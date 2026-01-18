"use client";

import { useGetArtistDataByIdQuery } from "@/app/store/api/artists.api";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUserAlbumReviews } from "@/app/store/reviews/selectors/album-reviews.selectors";
import { AlbumsListItem } from "@/app/album-charts/AlbumCharts/AlbumsList/AlbumsListItem/AlbumsListItem";
import { ArtistAlbumItem } from "./ArtistAlbumItem/ArtistAlbumItem";
import { orderBy } from "lodash-es";

export const Artist = () => {
  const searchParams = useSearchParams();
  const artistId = searchParams.get("id");
  const myAlbumReviews = useSelector(selectCurrentUserAlbumReviews);

  const { data, isLoading, isError } = useGetArtistDataByIdQuery(
    artistId as string,
    { skip: !artistId },
  );

  if (!artistId) {
    return <div className="p-4">Artist ID not provided</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (isError || !data) {
    return <div className="p-4">Artist not found</div>;
  }

  const { artist, albums } = data;
  const sortedAlbums = albums ? orderBy(albums, ["year"], ["desc"]) : [];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {artist.name}
      </h1>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Albums
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedAlbums?.map((album) => {
          const userReview = myAlbumReviews.find(
            (review) => review.albumId === album.id,
          );

          return (
            <ArtistAlbumItem
              key={album.id}
              album={album}
              artist={artist}
              userReview={userReview}
            />
          );
        })}
      </div>
    </div>
  );
};
