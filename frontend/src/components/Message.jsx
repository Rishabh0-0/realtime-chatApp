import React from "react";

const Message = ({ message }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (message.type === "chat") {
    return (
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex justify-center items-center text-white text-sm font-medium">
          {message.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span>{message.username}</span>
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </div>
        <p className="text-gray-800 mt-1">{message.message}</p>
      </div>
    );
  }

  return (
    <div className="text-center text-sm text-gray-500 italic">
      {message.message}
    </div>
  );
};

export default Message;
