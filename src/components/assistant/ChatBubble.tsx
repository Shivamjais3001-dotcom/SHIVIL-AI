import type { ReactNode } from "react";

interface ChatBubbleProps {
  sender: "user" | "ai";
  message: string;
  icon?: ReactNode;
}

function ChatBubble({
  sender,
  message,
  icon,
}: ChatBubbleProps) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex gap-4 mb-6 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div
          className="
          w-11
          h-11
          rounded-xl
          bg-gradient-to-br
          from-blue-500
          to-purple-600
          flex
          items-center
          justify-center
          text-white
          shrink-0
          "
        >
          {icon}
        </div>
      )}

      <div
        className={`
        max-w-xl
        rounded-2xl
        px-5
        py-4
        text-base
        leading-7
        ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-slate-900 border border-slate-800 text-slate-200"
        }
        `}
      >
        {message}
      </div>
    </div>
  );
}

export default ChatBubble;