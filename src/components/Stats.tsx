import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Award 
} from "lucide-react";

function Stats() {
  const statsData = [
    {
      value: "12,450",
      label: "Total Students",
      desc: "Across 8 disciplines",
      change: "+12.4%",
      color: "from-blue-500 to-cyan-500",
      icon: <Users className="text-blue-400" size={20} />
    },
    {
      value: "850+",
      label: "Expert Faculty",
      desc: "92% holding Ph.Ds",
      change: "Optimal ratio",
      color: "from-purple-500 to-indigo-500",
      icon: <GraduationCap className="text-purple-400" size={20} />
    },
    {
      value: "150+",
      label: "Curated Courses",
      desc: "Aligned with Industry 4.0",
      change: "+8 new electives",
      color: "from-emerald-500 to-teal-500",
      icon: <BookOpen className="text-emerald-400" size={20} />
    },
    {
      value: "95%",
      label: "Placement Rate",
      desc: "Top global tech partners",
      change: "+2% YoY increase",
      color: "from-pink-500 to-rose-500",
      icon: <Award className="text-pink-400" size={20} />
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#050814] relative border-t border-b border-slate-900">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-blue-400 font-bold">University Analytics</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Scale Academic Excellence in Real-Time
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            SHIVIL AI tracks high-volume transactional events hourly to present clean, structured operational signals to university management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div 
              key={index}
              className="relative group rounded-3xl border border-white/5 bg-slate-900/25 p-6 backdrop-blur-xl hover:border-slate-800 transition-all duration-300 hover:scale-[1.02] overflow-hidden shadow-2xl"
            >
              {/* Card accent gradient hover glow */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
              
              {/* Header Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-bold px-2 py-0.5 rounded-full bg-slate-950 border border-slate-900">
                  {stat.change}
                </span>
              </div>

              {/* Metric values */}
              <div className="space-y-1">
                <h3 className="text-3xl font-extrabold tracking-tight text-white font-mono">
                  {stat.value}
                </h3>
                <p className="text-sm font-semibold text-slate-300">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-500">
                  {stat.desc}
                </p>
              </div>

              {/* Base linear slide bar decoration */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Stats;