"use client";

import { useGetRecentAlbumReviewsQuery } from "../../../store/api/reviews.api";
import { ReviewCard } from "./ReviewCard/ReviewCard";

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
