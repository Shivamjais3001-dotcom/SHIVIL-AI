import { useState } from "react";
import { SendHorizonal } from "lucide-react";
interface ChatInputProps {
  onSend: (text: string) => void;
}

function ChatInput({ onSend }: ChatInputProps) {
    const [text, setText] = useState("");
  return (
    <div
      className="
      mt-8
      flex
      items-center
      gap-4
      bg-slate-900
      border
      border-slate-800
      rounded-2xl
      p-3
      "
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask SHIVIL AI anything..."
        className="
        flex-1
        bg-transparent
        outline-none
        text-white
        placeholder:text-slate-500
        px-2
        "
      />

      <button
      onClick={() => {
        
  if (!text.trim()) return;

  onSend(text);

  setText("");
}}
        className="
        w-12
        h-12
        rounded-xl
        bg-gradient-to-r
        from-blue-500
        to-purple-600
        flex
        items-center
        justify-center
        text-white
        hover:scale-105
        transition
        "
      >
        <SendHorizonal size={20} />
      </button>
    </div>
  );
}

export default ChatInput;