"use client";

import { useState } from "react";
import { RecentAlbumReviews } from "./RecentAlbumReviews/RecentAlbumReviews";
import { TopRecentReleases } from "./TopRecentReleases/TopRecentReleases";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("reviews");

  return (
    <div className="space-y-8">
      {/* Mobile Tabs */}
      <div className="lg:hidden sticky top-16 z-10 bg-white dark:bg-gray-900 flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === "reviews"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Recent Reviews
        </button>
        <button
          onClick={() => setActiveTab("releases")}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === "releases"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Top Recent Albums
        </button>
      </div>

      {/* Mobile Content */}
      <div className="p-1 lg:hidden">
        {activeTab === "reviews" ? (
          <RecentAlbumReviews />
        ) : (
          <TopRecentReleases />
        )}
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-2 gap-8 p-2 pt-4">
        <RecentAlbumReviews />
        <TopRecentReleases />
      </div>
    </div>
  );
};
