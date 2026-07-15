import type { ReactNode } from "react";

interface SuggestionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

function SuggestionCard({
  title,
  description,
  icon,
}: SuggestionCardProps) {
  return (
    <div
      className="
      group
      cursor-pointer
      bg-slate-900/60
      border
      border-slate-800
      rounded-2xl
      p-5
      backdrop-blur-xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-blue-500/40
      hover:shadow-[0_0_30px_rgba(59,130,246,0.20)]
      "
    >

      <div
        className="
        w-12
        h-12
        rounded-xl
        bg-gradient-to-br
        from-blue-500
        to-purple-600
        flex
        items-center
        justify-center
        text-white
        mb-4
        group-hover:scale-110
        transition
        "
      >
        {icon}
      </div>

      <h3 className="text-white font-semibold text-lg">
        {title}
      </h3>

      <p className="text-slate-400 text-sm mt-2">
        {description}
      </p>

    </div>
  );
}

export default SuggestionCard;