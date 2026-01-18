"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useGetUserPageDataQuery } from "../../store/api/users.api";
import { ALBUM_SCORE_OPTIONS } from "@/app/constants/album-score-options";
import { ReviewCard } from "@/app/home/Home/RecentAlbumReviews/ReviewCard/ReviewCard";
import { orderBy } from "lodash-es";

export const User = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [yearFilter, setYearFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");

  const { data, isLoading, isError } = useGetUserPageDataQuery(
    userId as string,
    { skip: !userId },
  );

  const filteredReviews = useMemo(() => {
    if (!data?.albumReviews) return [];

    let filtered = data.albumReviews.filter((review) => {
      const album = data.albums?.find((a) => a.id === review.albumId);
      const yearMatch = !yearFilter || album?.year?.toString() === yearFilter;
      const scoreMatch =
        !scoreFilter ||
        (scoreFilter === "AOTY"
          ? review.score === 5
          : review.score.toString() === scoreFilter);

      return yearMatch && scoreMatch;
    });

    if (!scoreFilter) {
      filtered = orderBy(filtered, ["score"], ["desc"]);
    }

    return filtered;
  }, [data, yearFilter, scoreFilter]);

  const availableYears = useMemo(() => {
    if (!data?.albums) return [];
    const years = [
      ...new Set(data.albums.map((album) => album.year).filter(Boolean)),
    ];
    return orderBy(years, [], ["desc"]);
  }, [data]);

  if (!userId) {
    return <div className="p-4">User ID not provided</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (isError || !data) {
    return <div className="p-4">User not found</div>;
  }

  const { user } = data;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {user.username}
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Year
          </label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Score
          </label>
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Scores</option>
            {ALBUM_SCORE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
            <option value="AOTY">AOTY</option>
          </select>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Reviews ({filteredReviews.length})
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};
