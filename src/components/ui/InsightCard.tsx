import { Sparkles } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  action?: string;
}

function InsightCard({
  title,
  description,
  action = "View Analysis",
}: InsightCardProps) {
  return (
    <div
      className="
      relative
      overflow-hidden
      bg-slate-900/60
      border
      border-slate-800
      rounded-2xl
      p-6
      backdrop-blur-xl
      hover:border-purple-500/40
      transition-all
      duration-300
      "
    >

      {/* Glow */}
      <div
        className="
        absolute
        -top-16
        -right-16
        w-40
        h-40
        bg-purple-500/20
        rounded-full
        blur-3xl
        "
      />


      <div className="relative flex items-start gap-4">

        {/* Icon */}
        <div
          className="
          w-12
          h-12
          rounded-xl
          bg-gradient-to-br
          from-purple-500
          to-blue-500
          flex
          items-center
          justify-center
          text-white
          "
        >
          <Sparkles size={24}/>
        </div>


        <div>
          <h3 className="text-white text-xl font-semibold">
            {title}
          </h3>

          <p className="text-slate-400 mt-2 leading-relaxed">
            {description}
          </p>

          <button
            className="
            mt-5
            px-5
            py-2
            rounded-xl
            bg-white/10
            text-white
            text-sm
            hover:bg-white/20
            transition
            "
          >
            {action}
          </button>

        </div>

      </div>

    </div>
  );
}

export default InsightCard;