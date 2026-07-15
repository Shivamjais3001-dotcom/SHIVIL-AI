import Sidebar from "../components/Sidebar";
import { Book, Bookmark, Sparkles } from "lucide-react";

function Library() {
  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <Book className="text-blue-500" size={28} />
                <span>Library Catalog</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Index of physical books, digital publications, book issues, and returns.
              </p>
            </div>
          </div>
          
          <div className="rounded-3xl border border-white/5 bg-slate-900/10 p-8 text-center max-w-xl mx-auto mt-20 space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto text-blue-400">
              <Bookmark size={24} />
            </div>
            <h2 className="text-lg font-bold text-white">No Books Checked Out</h2>
            <p className="text-slate-400 text-xs">
              Physical library cards and online publications log are currently offline.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Library;
