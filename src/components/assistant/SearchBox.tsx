import { Search, ArrowRight } from "lucide-react";

function SearchBox() {
  return (
    <div
      className="
      bg-slate-900/70
      border
      border-slate-800
      rounded-3xl
      p-3
      backdrop-blur-xl
      shadow-xl
      "
    >
      <div className="flex items-center gap-3">

        <Search
          className="text-slate-500 ml-2"
          size={22}
        />

        <input
          type="text"
          placeholder="Ask anything about students, faculty, attendance..."
          className="
          flex-1
          bg-transparent
          outline-none
          text-white
          placeholder:text-slate-500
          py-3
          "
        />

        <button
          className="
          w-12
          h-12
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          text-white
          flex
          items-center
          justify-center
          hover:scale-105
          transition
          "
        >
          <ArrowRight size={20} />
        </button>

      </div>
    </div>
  );
}

export default SearchBox;