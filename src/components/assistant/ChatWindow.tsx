import { useState } from "react";
import { Sparkles } from "lucide-react";
import ChatInput from "./ChatInput";

import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

function ChatWindow() {
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        
  {
    sender: "ai",
    text: "Hello Shivam 👋 Welcome to SHIVIL AI. I can help you manage students, faculty, attendance, courses and generate university reports.",
  },
  
]);

function sendMessage(text: string) {
  if (!text.trim()) return;

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text,
    },
  ]);

  setIsTyping(true);

  setTimeout(() => {
    let reply = "";

  if (text.toLowerCase().includes("hello")) {
    reply = "Hello Shivam 👋 How can I help you today?";
  }

  else if (text.toLowerCase().includes("student")) {
    reply = "I can help you manage student records.";
  }

  else {
    reply = "Sorry, I didn't understand that.";
  }
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: reply,
      },
    ]);

    setIsTyping(false);
  }, 1500);
}
  return (
    <div
      className="
      mt-10
      rounded-3xl
      border
      border-slate-800
      bg-slate-950/60
      backdrop-blur-xl
      p-8
      "
    >
      {messages.map((message, index) => (
  <ChatBubble
    key={index}
    sender={message.sender as "user" | "ai"}
    message={message.text}
    icon={
      message.sender === "ai" ? (
        <Sparkles size={22} />
      ) : undefined
    }
  />
))}
      {isTyping && <TypingIndicator />}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}

export default ChatWindow;