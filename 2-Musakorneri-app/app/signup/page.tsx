"use client";

import { useState } from "react";
import { signUp, confirmSignUp } from "../../lib/auth";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      setNeedsConfirmation(true);
      setMessage("Check your email for confirmation code");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignUp(email, confirmationCode);
      setMessage("Account confirmed! You can now login");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={handleConfirm} className="w-full max-w-md space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Confirm Email</h2>
          <input
            type="text"
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className="form-input"
            required
          />
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            Confirm
          </button>
          {message && <p className="text-center text-sm text-gray-600 dark:text-gray-400">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSignUp} className="w-full max-w-md space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
          Sign Up
        </button>
        {message && <p className="text-center text-sm text-gray-600 dark:text-gray-400">{message}</p>}
      </form>
    </div>
  );
}