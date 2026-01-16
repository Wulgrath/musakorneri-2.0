"use client";

import { useState } from "react";
import {
  signIn,
  confirmSignUp,
  resendConfirmationCode,
} from "../../../lib/auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const result = await signIn(email, password);
      if (result.AuthenticationResult?.AccessToken) {
        setMessage("Login successful!");
        localStorage.setItem(
          "accessToken",
          result.AuthenticationResult.AccessToken,
        );
        if (result.AuthenticationResult.RefreshToken) {
          localStorage.setItem(
            "refreshToken",
            result.AuthenticationResult.RefreshToken,
          );
        }
        window.location.href = "/";
      }
    } catch (error: any) {
      if (error.name === "UserNotConfirmedException") {
        setNeedsConfirmation(true);
        setMessage("Please confirm your email address first.");
      } else {
        setMessage(error.message);
      }
    }
  };

  const handleConfirm = async (e: any) => {
    e.preventDefault();
    try {
      await confirmSignUp(email, confirmationCode);

      // Automatically log in after confirmation
      const result = await signIn(email, password);
      if (result.AuthenticationResult?.AccessToken) {
        setMessage("Account confirmed and logged in!");
        localStorage.setItem(
          "accessToken",
          result.AuthenticationResult.AccessToken,
        );
        if (result.AuthenticationResult.RefreshToken) {
          localStorage.setItem(
            "refreshToken",
            result.AuthenticationResult.RefreshToken,
          );
        }
        window.location.href = "/";
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendConfirmationCode(email);
      setMessage("Confirmation code sent to your email");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={handleConfirm}
          className="w-full max-w-md space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Confirm Email
          </h2>
          <input
            type="text"
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className="form-input"
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={handleResendCode}
            className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
          >
            Resend Code
          </button>
          <button
            type="button"
            onClick={() => setNeedsConfirmation(false)}
            className="w-full py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white rounded-md"
          >
            Back to Login
          </button>
          {message && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Login
        </h2>
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
        {message && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        )}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {"Don't have an account?"}
          <a
            href="/signup"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
};
