"use client";

import { useChat } from "ai/react";
import { ChatInput } from "./ui/chat-input";
import { ChatMessages } from "./ui/chat-messages";
import { BiMessageAltDetail } from "react-icons/bi";

export default function Chat() {
  const { messages, input, isLoading, handleSubmit, handleInputChange } = useChat({
    api: process.env.NEXT_PUBLIC_CHAT_API,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <div className="flex flex-col w-full h-full justify-end bg-white border p-4">
      {messages.length > 0 ? (
      null
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
        <BiMessageAltDetail size={70} />
        <h1 className="text-lg font-thin ml-2">เริ่มการสนทนา</h1>
      </div>
      )}
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
