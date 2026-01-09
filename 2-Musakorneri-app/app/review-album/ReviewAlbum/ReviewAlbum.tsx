"use client";

import { useState } from "react";
import { useCreateReviewMutation } from "../../store/api/reviews.api";

export const ReviewAlbum = () => {
  const [artist, setArtist] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [year, setYear] = useState("");
  const [score, setScore] = useState(1);
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({ artist, albumName, year, score }).unwrap();
      // Reset form
      setArtist("");
      setAlbumName("");
      setYear("");
      setScore(1);
    } catch (error) {
      console.error("Failed to create review:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Review Album</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Album Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Album Name"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 border rounded"
          min="1900"
          max="2030"
          required
        />
        <div>
          <label className="block mb-2">Score (1-5):</label>
          <select
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full p-2 border rounded"
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
