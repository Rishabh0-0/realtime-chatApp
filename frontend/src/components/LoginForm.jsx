import React, { useState } from "react";
import { useChat } from "../context/ChatContext";

const LoginForm = () => {
  const { state, actions } = useChat();

  const [usernameInput, setUsernameInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      actions.setUseranme(usernameInput.trim());
      actions.joinChat();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 to-purple-950 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full m">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Join Chat Room
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your username..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={20}
            required
          />
          <button
            type="submit"
            disabled={
              !usernameInput.trim() || state.connectionStatus !== "Connected"
            }
            className="w-full px-4 py-3 bg-fuchsia-700 text-white rounded-lg hover:bg-fuchsia-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {state.connectionStatus === "Connected"
              ? "Join Chat"
              : "Connecting..."}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span
            className={`inline-flex text-sm items-center ${
              state.connectionStatus === "Connected"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full mr-2 ${
                state.connectionStatus === "Connected"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
            {state.connectionStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
