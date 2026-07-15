function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 py-4">
      <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"></div>
      <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce delay-150"></div>
      <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce delay-300"></div>

      <span className="text-slate-400 ml-3">
        SHIVIL AI is thinking...
      </span>
    </div>
  );
}

export default TypingIndicator;