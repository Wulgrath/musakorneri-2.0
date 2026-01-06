"use client";

import { useState } from "react";
import { signIn } from "../../../lib/auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn(email, password);
      if (result.AuthenticationResult) {
        setMessage("Login successful!");
        // Store token and redirect
        localStorage.setItem("accessToken", result.AuthenticationResult.AccessToken);
        window.location.href = "/";
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login</h2>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Login
        </button>
        {message && <p className="text-center text-sm text-gray-600 dark:text-gray-400">{message}</p>}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
};
