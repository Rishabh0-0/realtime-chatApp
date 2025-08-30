import React from "react";
import Message from "./Message";

const MessageContainer = ({
  messages = [
    {
      type: "chat",
      username: "Rishabh",
      message: "Hello",
      timestamp: new Date(),
      id: 1,
    },
    {
      type: "chat",
      username: "Alex",
      message: "Hi",
      timestamp: new Date(),
      id: 2,
    },
  ],
  typingUsers = ["Rishabh", "Bob"],
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {typingUsers.length > 0 && (
        <div className="text-sm italic text-gray-500 mb-4">
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
          typing...
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
