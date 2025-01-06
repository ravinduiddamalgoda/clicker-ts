import React, { useState, useContext } from "react";
import { GameContext } from "../context/GameContext";

const LoginPage = () => {
  const { handleLogin, setCurrentView, handleGoogleAuth } = useContext(GameContext)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-textPrimary">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-background text-textPrimary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-background text-textPrimary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Login
          </button> */}
<button
  onClick={() => handleGoogleAuth()}
  className="w-full bg-white text-blue-600 py-2 rounded border border-blue-600 hover:bg-blue-600 hover:text-white transition duration-300 flex items-center justify-center"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="w-5 h-5 mr-2"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.1 0 5.9 1.2 8.1 3.3l6.1-6.1C33.4 3.4 28.9 1.5 24 1.5 14.8 1.5 7.1 7.8 4.5 16.3l7.3 5.7C13.1 14.2 18.1 9.5 24 9.5z"
    />
    <path
      fill="#FBBC05"
      d="M46.5 24c0-1.6-.2-3.1-.5-4.5H24v9.1h12.7c-.5 2.7-2.1 5-4.3 6.5l7 5.5c4.1-3.8 6.6-9.5 6.6-16.6z"
    />
    <path
      fill="#34A853"
      d="M10.8 27.6c-.5-1.6-.8-3.3-.8-5.1s.3-3.5.8-5.1l-7.3-5.7C1.5 14.9 0 19.3 0 24s1.5 9.1 4.5 12.8l7.3-5.7z"
    />
    <path
      fill="#4285F4"
      d="M24 46.5c5.9 0 11.3-2 15.4-5.5l-7-5.5c-2.1 1.4-4.8 2.2-7.8 2.2-5.9 0-10.9-4.7-12.4-10.9l-7.3 5.7C7.1 40.2 14.8 46.5 24 46.5z"
    />
  </svg>
  Sign in with Google
</button>

        </form>
        {/* <button
          onClick={() => setCurrentView("RegisterPage")}
          className="mt-4 text-sm text-textSecondary hover:text-primary transition"
        >
          Go to Register
        </button> */}
      </div>
    </div>
  );
};

export default LoginPage;
