import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  trend?: string;
  idx?: number;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  idx = 0
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative overflow-hidden bg-slate-950/40 border border-white/5 backdrop-blur-xl p-6 rounded-2xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_15px_40px_rgba(59,130,246,0.1)] group select-none cursor-default"
    >
      {/* Background radial hover glow */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Floating Blur Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500 pointer-events-none" />

      {/* Icon with micro animation */}
      <motion.div 
        whileHover={{ rotate: 5, scale: 1.05 }}
        className="relative w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20 text-blue-400 mb-5"
      >
        {icon}
      </motion.div>

      {/* Content */}
      <p className="text-slate-400 text-xs font-medium tracking-tight uppercase">
        {title}
      </p>

      <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2 font-mono">
        {value}
      </h2>

      <div className="flex justify-between items-center mt-4">
        <p className="text-[11px] text-slate-500 font-medium">
          {subtitle}
        </p>

        {trend && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default StatCard;