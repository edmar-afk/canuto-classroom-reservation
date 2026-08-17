import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  UsersRound,
  BookOpen,
  School,
  Layers3,
  CalendarDays,
  TriangleAlert,
  FileText,
  ArrowUpRight,
} from "lucide-react";

function CountUp({ end, duration = 900 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;

      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

function StatsCard() {
  const stats = [
    {
      title: "Academic Programs",
      value: 12,
      icon: GraduationCap,
      type: "normal",
    },
    {
      title: "Instructors",
      value: 85,
      icon: UsersRound,
      type: "normal",
    },
    {
      title: "Subjects",
      value: 156,
      icon: BookOpen,
      type: "normal",
    },
    {
      title: "Classrooms",
      value: 28,
      icon: School,
      type: "normal",
    },
    {
      title: "Sections",
      value: 64,
      icon: Layers3,
      type: "normal",
    },
    {
      title: "Schedules",
      value: 142,
      icon: CalendarDays,
      type: "normal",
    },
    {
      title: "Conflicts",
      value: 3,
      icon: TriangleAlert,
      type: "warning",
    },
    {
      title: "Reports",
      value: 18,
      icon: FileText,
      type: "normal",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isWarning = stat.type === "warning";

        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
          >
            {/* Top Content */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  isWarning ? "bg-red-50" : "bg-emerald-50"
                }`}
              >
                <Icon
                  size={24}
                  strokeWidth={1.8}
                  className={isWarning ? "text-red-500" : "text-[#4F8F68]"}
                />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-700">
                  {stat.title}
                </p>

                <p
                  className={`mt-1 text-3xl font-bold tracking-tight ${
                    isWarning ? "text-red-500" : "text-slate-900"
                  }`}
                >
                  <CountUp end={stat.value} duration={900} />
                </p>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="mt-6 flex justify-end">
              <button
                className={`group/link flex items-center gap-1 text-xs font-semibold transition-colors ${
                  isWarning
                    ? "text-red-400 hover:text-red-500"
                    : "text-emerald-700 hover:text-[#173B2F]"
                }`}
              >
                View all
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </button>
            </div>

            {/* Bottom Accent */}
            <div
              className={`absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-300 group-hover:w-full ${
                isWarning ? "bg-red-400" : "bg-[#4F8F68]"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default StatsCard;
