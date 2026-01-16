"use client";

import { useState, useRef, useEffect } from "react";
import { Album, Artist, AlbumReview } from "@/types";
import { useUpdateAlbumReviewMutation } from "@/app/store/api/reviews.api";
import Link from "next/link";

interface AlbumsListItemProps {
  album: Album;
  artist?: Artist;
  userReview?: AlbumReview;
}

const SCORE_OPTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export const AlbumsListItem = ({
  album,
  artist,
  userReview,
}: AlbumsListItemProps) => {
  const [imageError, setImageError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [updateReview] = useUpdateAlbumReviewMutation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleScoreChange = async (newScore: number) => {
    await updateReview({ albumId: album.id, score: newScore });
    setShowDropdown(false);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-visible">
      <div className="flex items-center h-full px-2 py-1">
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 ml-2 flex items-center justify-center ${
            imageError ? "border border-gray-300 dark:border-gray-600" : ""
          }`}
        >
          <img
            src={`https://musakorneri-files.s3.amazonaws.com/album-covers/thumbs/${album.id}.jpg`}
            alt={`${album.name} cover`}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              setImageError(true);
            }}
          />
          {imageError && (
            <span className="text-xs text-gray-400 dark:text-gray-500 text-center px-1">
              Missing cover art
            </span>
          )}
        </div>
        <div className="flex-1 py-2 px-3 sm:py-2 sm:px-3 flex flex-col justify-center min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {album.name}
            {album.year && (
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 font-normal ml-2">
                ({album.year})
              </span>
            )}
          </h3>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
            <Link
              href={`/artist?id=${artist?.id}`}
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              {artist?.name}
            </Link>
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2 items-center">
            {album.reviewScore && (
              <>
                <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded w-12 h-9 sm:w-14 sm:h-10">
                  <span
                    className="text-lg sm:text-xl font-bold"
                    style={{
                      color: `hsl(${
                        ((album.reviewScore - 1) / 4) * 120
                      }, 50%, 45%)`,
                    }}
                  >
                    {album.reviewScore}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  ({album.reviewCount || 0} reviews)
                </span>
              </>
            )}
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center mx-2 sm:mx-4 flex-shrink-0 relative"
          ref={dropdownRef}
        >
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
            {"Your score:"}
          </span>
          <div
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-16 h-14 sm:w-16 sm:h-14 cursor-pointer transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {userReview ? (
              <span
                className="text-2xl sm:text-2xl font-bold"
                style={{
                  color: `hsl(${((userReview.score - 1) / 4) * 120}, 50%, 45%)`,
                }}
              >
                {userReview.score}
              </span>
            ) : (
              <span className="text-2xl sm:text-2xl font-bold text-gray-400 dark:text-gray-500">
                –
              </span>
            )}
          </div>
          {showDropdown && (
            <div className="absolute top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 py-1">
              {SCORE_OPTIONS.map((score) => (
                <button
                  key={score}
                  onClick={() => handleScoreChange(score)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span
                    className="font-bold"
                    style={{
                      color: `hsl(${((score - 1) / 4) * 120}, 50%, 45%)`,
                    }}
                  >
                    {score}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
