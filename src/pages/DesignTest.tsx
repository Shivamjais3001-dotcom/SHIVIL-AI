import { Users, GraduationCap, BookOpen, CalendarDays } from "lucide-react";

import StatCard from "../components/ui/StatCard";

function DesignTest() {
  return (
    <div className="min-h-screen bg-slate-950 p-10">

      <h1 className="text-4xl font-bold text-white mb-10">
        SHIVIL AI Design System
      </h1>


      <div className="grid grid-cols-4 gap-6">

        <StatCard
          title="Students"
          value="12,450"
          subtitle="Registered Students"
          trend="+12%"
          icon={<Users size={24} />}
        />


        <StatCard
          title="Faculty"
          value="850"
          subtitle="Active Faculty"
          trend="+5%"
          icon={<GraduationCap size={24} />}
        />


        <StatCard
          title="Courses"
          value="150"
          subtitle="Available Courses"
          trend="+8%"
          icon={<BookOpen size={24} />}
        />


        <StatCard
          title="Attendance"
          value="95%"
          subtitle="Overall Attendance"
          trend="+2%"
          icon={<CalendarDays size={24} />}
        />

      </div>

    </div>
  );
}

export default DesignTest;