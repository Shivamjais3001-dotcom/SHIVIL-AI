import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
};

function DashboardCard({
  title,
  value,
  icon,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">

      <div className="text-blue-700 mb-4">
        {icon}
      </div>

      <h3 className="text-gray-500">
        {title}
      </h3>

      <h1 className="text-4xl font-bold mt-3 text-blue-700">
        {value}
      </h1>

    </div>
  );
}

export default DashboardCard;