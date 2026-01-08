"use client";

import { useState } from "react";
import {
  useGetCurrentUserQuery,
  useUpdateUsernameMutation,
} from "../../store/api/users.api";

export const Profile = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();
  const [updateUsername] = useUpdateUsernameMutation();
  const [username, setUsername] = useState(currentUser?.username || "");

  const handleUpdateUsername = async () => {
    if (username !== currentUser?.username) {
      updateUsername({ username });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Profile
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={currentUser?.email || ""}
            className="form-input"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
          />
        </div>
        <button
          onClick={handleUpdateUsername}
          disabled={username === currentUser?.username}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md"
        >
          Update Username
        </button>
      </div>
    </div>
  );
};
