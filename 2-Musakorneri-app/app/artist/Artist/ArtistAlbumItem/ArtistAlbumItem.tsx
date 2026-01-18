"use client";

import { useState, useRef, useEffect } from "react";
import { Album, Artist, AlbumReview } from "@/types";
import { useUpdateAlbumReviewMutation } from "@/app/store/api/reviews.api";
import Link from "next/link";
import Image from "next/image";
import { ALBUM_SCORE_OPTIONS } from "@/app/constants/album-score-options";

interface ArtistAlbumItemProps {
  album: Album;
  artist?: Artist;
  userReview?: AlbumReview;
}

export const ArtistAlbumItem = ({
  album,
  artist,
  userReview,
}: ArtistAlbumItemProps) => {
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
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-visible relative">
      <div className="flex items-start h-full px-1 py-1">
        <div
          className={`w-26 h-26 sm:w-28 sm:h-28 flex-shrink-0  flex items-center justify-center ${
            imageError ? "border border-gray-300 dark:border-gray-600" : ""
          }`}
        >
          <Image
            src={`https://musakorneri-files.s3.amazonaws.com/album-covers/thumbs/${album?.id}.jpg`}
            alt={`${album?.name || "Unknown Album"} cover`}
            width={112}
            height={112}
            className="object-contain"
            onError={() => setImageError(true)}
          />
          {imageError && (
            <span className="text-xs text-gray-400 dark:text-gray-500 text-center px-1">
              Missing cover art
            </span>
          )}
        </div>
        <div className="px-2 sm:py-1 sm:px-2 flex flex-col justify-start min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {album.name}
          </h3>
          {album.year && (
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-1">
              {album.year}
            </p>
          )}

          {album?.reviewScore && (
            <div className="flex flex-col items-start justify-center mt-1">
              <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                <span
                  className="text-2xl font-bold"
                  style={{
                    color: `hsl(${((album.reviewScore - 1) / 4) * 120}, 50%, 45%)`,
                  }}
                >
                  {album.reviewScore}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-400">
                  {album.reviewCount || 0} reviews
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute right-2 bottom-2" ref={dropdownRef}>
        <div
          className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="text-xs text-gray-400 dark:text-gray-400">
            Your score
          </span>
          <div className="flex items-center justify-center gap-1">
            {userReview ? (
              <span
                className="text-lg font-bold"
                style={{
                  color: `hsl(${((userReview.score - 1) / 4) * 120}, 50%, 45%)`,
                }}
              >
                {userReview.score}
              </span>
            ) : (
              <span className="text-lg font-bold text-gray-400 dark:text-gray-500">
                –
              </span>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-500">▼</span>
          </div>
        </div>
        {showDropdown && (
          <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 py-1">
            {ALBUM_SCORE_OPTIONS.map((score) => (
              <button
                key={score.value}
                onClick={() => handleScoreChange(score.value)}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                <span
                  className="font-bold"
                  style={{
                    color: `hsl(${((score.value - 1) / 4) * 120}, 50%, 45%)`,
                  }}
                >
                  {score.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
