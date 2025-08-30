import React from "react";

const Header = ({ connectionStatus = "Connected", userCount = 2 }) => {
  return (
    <div className="bg-white border-b shadow-sm border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Chat Room</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                connectionStatus === "Connected" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            {connectionStatus}
          </span>
          <span>{userCount} users online</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
