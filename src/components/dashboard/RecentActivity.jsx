import React from "react";
import {
  CalendarPlus,
  FilePlus2,
  TriangleAlert,
  UserPlus,
  School,
  BookOpen,
  ChevronRight,
} from "lucide-react";

function RecentActivity() {
  const activities = [
    {
      type: "schedule",
      title: "New schedule added",
      description: "BSIT 3A — Database Management",
      time: "5 minutes ago",
      icon: CalendarPlus,
    },
    {
      type: "report",
      title: "New report submitted",
      description: "Room conflict reported in Room 204",
      time: "18 minutes ago",
      icon: FilePlus2,
    },
    {
      type: "conflict",
      title: "Schedule conflict detected",
      description: "Monday, 10:00 AM — Room 305",
      time: "32 minutes ago",
      icon: TriangleAlert,
    },
    {
      type: "instructor",
      title: "New instructor added",
      description: "Maria Santos — Computer Science",
      time: "1 hour ago",
      icon: UserPlus,
    },
    {
      type: "room",
      title: "New classroom added",
      description: "Laboratory Room 3",
      time: "2 hours ago",
      icon: School,
    },
    {
      type: "subject",
      title: "New subject added",
      description: "Advanced Database Systems",
      time: "3 hours ago",
      icon: BookOpen,
    },
  ];

  const styles = {
    schedule: {
      icon: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    },
    report: {
      icon: "bg-blue-50 text-blue-600",
      dot: "bg-blue-500",
    },
    conflict: {
      icon: "bg-red-50 text-red-500",
      dot: "bg-red-500",
    },
    instructor: {
      icon: "bg-violet-50 text-violet-600",
      dot: "bg-violet-500",
    },
    room: {
      icon: "bg-amber-50 text-amber-600",
      dot: "bg-amber-500",
    },
    subject: {
      icon: "bg-cyan-50 text-cyan-600",
      dot: "bg-cyan-500",
    },
  };

  return (
    <div className="flex h-[440px] min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Latest updates from your scheduling system
            </p>
          </div>

          <button className="flex items-center gap-1 text-xs font-semibold text-emerald-700 transition-colors hover:text-[#173B2F]">
            View all
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable Activity List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const style = styles[activity.type];
          const isLast = index === activities.length - 1;

          return (
            <div key={index} className="group relative flex gap-4 py-4">
              {!isLast && (
                <div className="absolute left-[19px] top-[52px] h-[calc(100%-28px)] w-px bg-slate-100" />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
              >
                <Icon size={18} strokeWidth={1.8} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-800">
                    {activity.title}
                  </p>

                  <span className="shrink-0 text-[11px] font-medium text-slate-400">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {activity.description}
                </p>
              </div>

              <span
                className={`mt-3 hidden h-1.5 w-1.5 shrink-0 rounded-full sm:block ${style.dot}`}
              />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-slate-100 px-5 py-3 sm:px-6">
        <p className="text-center text-[11px] font-medium text-slate-400">
          Showing the latest {activities.length} activities
        </p>
      </div>
    </div>
  );
}

export default RecentActivity;
