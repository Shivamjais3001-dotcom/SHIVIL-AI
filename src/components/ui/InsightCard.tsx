import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface InsightCardProps {
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
  idx?: number;
}

function InsightCard({
  title,
  description,
  action = "View Analysis",
  onAction,
  idx = 0
}: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.005 }}
      className="relative overflow-hidden bg-slate-950/45 border border-white/5 rounded-2xl p-6 backdrop-blur-xl hover:border-purple-500/30 transition-all duration-300 shadow-xl group"
    >
      {/* Glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/25 transition-colors duration-500 pointer-events-none" />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
          <Sparkles size={20} className="animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white text-base font-bold tracking-tight">
            {title}
          </h3>

          <p className="text-slate-400 text-xs mt-2 leading-relaxed font-sans">
            {description}
          </p>

          {action && (
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onAction}
              className="mt-4 px-4 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:text-white transition cursor-pointer flex items-center gap-1.5 border border-white/5"
            >
              <span>{action}</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default InsightCard;