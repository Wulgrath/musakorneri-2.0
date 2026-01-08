"use client";

import { useState } from "react";
import {
  useGetCurrentUserQuery,
  useUpdateUsernameMutation,
} from "../../store/api/users.api";

export const Profile = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();
  const [updateUsername, { isLoading: isUpdating }] = useUpdateUsernameMutation();
  const [username, setUsername] = useState("");

  if (isLoading || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (username === "") {
    setUsername(currentUser.username);
  }

  const handleUpdateUsername = () => {
    if (username !== currentUser.username && username.trim()) {
      updateUsername({ username: username.trim() });
    }
  };

  const isUsernameChanged = username !== currentUser.username && username.trim();

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
            value={currentUser.email}
            className="form-input"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
            <button
              onClick={handleUpdateUsername}
              disabled={!isUsernameChanged || isUpdating}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Updating..." : "Update Username"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
