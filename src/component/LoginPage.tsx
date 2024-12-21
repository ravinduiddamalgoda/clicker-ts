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
          <input
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
          </button>
          <button
            onClick={ () => handleGoogleAuth()}
            className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Login with Google
          </button>
        </form>
        <button
          onClick={() => setCurrentView("RegisterPage")}
          className="mt-4 text-sm text-textSecondary hover:text-primary transition"
        >
          Go to Register
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
