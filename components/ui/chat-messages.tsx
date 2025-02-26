import { Message } from "ai";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

export const ChatMessages = (props: Props) => {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = props.messages.length;
  const lastMessage = props.messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop = scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant = messageLength > 0 && lastMessage?.role !== "user";
  const isPending = props.isLoading && !isLastMessageFromAssistant;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  return (
    <div
      ref={scrollableChatContainerRef}
      className="overflow-auto p-4 space-y-8 h-full"
    >
      {props.messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`p-3 ${message.role === "user"
                ? "bg-gray-400 text-black rounded-md"
                : "bg-gray-200 text-black rounded-lg"
              }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {isPending && (
        <div className="flex justify-start">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
};
