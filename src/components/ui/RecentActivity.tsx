import {
  UserPlus,
  GraduationCap,
  BookOpen,
  FileText,
} from "lucide-react";


const activities = [
  {
    title: "New student registered",
    description: "A new student profile was created",
    time: "2 minutes ago",
    icon: <UserPlus size={18} />,
  },
  {
    title: "Faculty profile updated",
    description: "Faculty information was modified",
    time: "1 hour ago",
    icon: <GraduationCap size={18} />,
  },
  {
    title: "New course created",
    description: "Academic course has been added",
    time: "Today",
    icon: <BookOpen size={18} />,
  },
  {
    title: "Report generated",
    description: "Analytics report was generated",
    time: "Today",
    icon: <FileText size={18} />,
  },
];


function RecentActivity() {
  return (
    <div
      className="
      bg-slate-900/60
      border
      border-slate-800
      rounded-2xl
      p-6
      backdrop-blur-xl
      "
    >

      <h2 className="text-white text-2xl font-semibold mb-6">
        Recent Activity
      </h2>


      <div className="space-y-5">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex gap-4 items-start"
          >

            <div
              className="
              w-10
              h-10
              rounded-full
              bg-gradient-to-br
              from-blue-500
              to-purple-600
              flex
              items-center
              justify-center
              text-white
              "
            >
              {activity.icon}
            </div>


            <div>

              <h3 className="text-white font-medium">
                {activity.title}
              </h3>

              <p className="text-slate-400 text-sm">
                {activity.description}
              </p>

              <span className="text-slate-500 text-xs">
                {activity.time}
              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}


export default RecentActivity;