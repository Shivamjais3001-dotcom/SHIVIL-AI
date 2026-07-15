import { 
  Terminal, 
  Users, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Database,
  Layers,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

function Features() {
  const featuresList = [
    {
      title: "Intelligent Student Portal",
      desc: "Complete self-service node where students manage grading curves, tuition channels, course registry, and view real-time feedback insights.",
      icon: <Users className="text-blue-400" size={24} />,
      bullets: ["Real-time GPA tracking", "Frictionless fees gateway", "Course syllabus download"],
      badge: "Self-Service"
    },
    {
      title: "Autonomous Faculty Board",
      desc: "Empowers department coordinators with automated class grids, attendance records, exam publishers, and workload recommendations.",
      icon: <GraduationCap className="text-purple-400" size={24} />,
      bullets: ["Dynamic class schedules", "Performance analytics", "Research publisher log"],
      badge: "Coordination"
    },
    {
      title: "Integrated Campus Analytics",
      desc: "Gives administrators high-fidelity operational visibility into university metrics, student retention risks, and financial cashflow reports.",
      icon: <Layers className="text-emerald-400" size={24} />,
      bullets: ["Attendance alert system", "Financial ledger tracker", "Placement record forecast"],
      badge: "Real-time Ops"
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[#030712] relative overflow-hidden">
      
      {/* Background glow flares */}
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-20 text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-xs font-semibold text-purple-400">
            <Sparkles size={12} />
            <span>Operational Excellence</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Designed to Run Universities at <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Hyper-Efficiency.</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
            Current university systems are broken silos. SHIVIL AI unifies administrative registries and classrooms under an intelligent, hyper-fast semantic interface.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuresList.map((feat, idx) => (
            <div 
              key={idx}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/5 bg-slate-900/10 p-8 backdrop-blur-md hover:border-slate-800 hover:bg-slate-900/35 transition-all duration-300 shadow-2xl"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] tracking-wider uppercase font-bold text-slate-500 px-2.5 py-1 rounded-md bg-slate-950/60 border border-slate-900">
                    {feat.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                  {feat.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {feat.desc}
                </p>

                {/* Capabilities list */}
                <ul className="space-y-2.5 border-t border-slate-900 pt-6 mb-6">
                  {feat.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action trigger link */}
              <Link 
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-white transition-colors duration-200 mt-4 group/btn"
              >
                <span>Launch Portal</span>
                <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>

              {/* Decorative top right glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-purple-500/0 rounded-tr-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;