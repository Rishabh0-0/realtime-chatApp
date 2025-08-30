import React, { useState } from "react";

const InputArea = ({ connectionStatus = "Connected" }) => {
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = () => {
    if (inputMessage.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "chat",
          message: inputMessage.trim(),
        })
      );
      setInputMessage("");
      handleStopTyping();
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    handleTyping();
  };

  const handleTyping = () => {
    if (!isTyping && socket && socket.readyState === WebSocket.OPEN) {
      setIsTyping(true);
      socket.send(
        JSON.stringify({
          type: "typing",
          isTyping: true,
        })
      );
    }
  };

  const handleStopTyping = () => {
    if (isTyping && socket && socket.readyState === WebSocket.OPEN) {
      setIsTyping(false);
      socket.send(
        JSON.stringify({
          type: "typing",
          isTyping: false,
        })
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (isUsernameSet) {
        sendMessage();
      } else {
        setUsernameAndJoin();
      }
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={connectionStatus !== "Connected"}
        />
        <button
          onClick={sendMessage}
          disabled={connectionStatus !== "Connected" || !inputMessage.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
        transition-colors font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default InputArea;
