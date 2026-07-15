import type { ReactNode } from "react";
import { Card } from "./card";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  trend?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatCardProps) {
  return (
    <Card
      className="
      relative
      overflow-hidden
      bg-slate-900/60
      border-slate-800
      backdrop-blur-xl
      p-6
      rounded-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-blue-500/50
      hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]
      "
    >

      {/* Glow */}
      <div
        className="
        absolute
        -top-10
        -right-10
        w-32
        h-32
        bg-blue-500/20
        rounded-full
        blur-3xl
        "
      />


      {/* Icon */}
      <div
        className="
        relative
        w-12
        h-12
        rounded-xl
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-blue-500
        to-purple-600
        text-white
        mb-5
        "
      >
        {icon}
      </div>


      {/* Content */}
      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-white mt-2">
        {value}
      </h2>


      <div className="flex justify-between items-center mt-4">

        <p className="text-sm text-slate-500">
          {subtitle}
        </p>


        {trend && (
          <span
            className="
            text-xs
            px-3
            py-1
            rounded-full
            bg-green-500/10
            text-green-400
            "
          >
            {trend}
          </span>
        )}

      </div>


    </Card>
  );
}

export default StatCard;