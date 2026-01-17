"use client";

import { useState, useRef, useEffect } from "react";
import { useCreateReviewMutation } from "../../store/api/reviews.api";
import { useGetArtistsBaseDataQuery } from "../../store/api/artists.api";

export const ReviewAlbum = () => {
  const [artist, setArtist] = useState("");
  const [debouncedArtist, setDebouncedArtist] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [score, setScore] = useState(1);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const { data: artists = [] } = useGetArtistsBaseDataQuery();

  // Debounce artist input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedArtist(artist);
    }, 300);

    return () => clearTimeout(timer);
  }, [artist]);

  const filteredArtists = debouncedArtist.trim()
    ? artists
        .filter((a) =>
          a.name.toLowerCase().includes(debouncedArtist.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleArtistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtist(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleArtistSelect = (artistName: string) => {
    setArtist(artistName);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createReview({ artist, albumName, score }).unwrap();
      // Reset form on success
      setArtist("");
      setAlbumName("");
      setScore(1);
    } catch (error: any) {
      if (error.status === 401) {
        setError("You must be logged in to submit a review.");
      } else {
        setError("Failed to create review. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Review Album</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Artist"
            value={artist}
            onChange={handleArtistChange}
            onFocus={() => artist.length > 0 && setShowSuggestions(true)}
            className="w-full p-2 border rounded"
            required
          />

          {showSuggestions && filteredArtists.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {filteredArtists.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleArtistSelect(a.name)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Album Name"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <div>
          <label className="block mb-2">Score (1-5):</label>
          <select
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};
