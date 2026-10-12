import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";
import { CalendarDays, DoorOpen } from "lucide-react";

function LineChart() {
  const [view, setView] = useState("scheduled");

  const data = [
    {
      day: "Monday",
      scheduled: 28,
      available: 12,
    },
    {
      day: "Tuesday",
      scheduled: 35,
      available: 8,
    },
    {
      day: "Wednesday",
      scheduled: 31,
      available: 14,
    },
    {
      day: "Thursday",
      scheduled: 42,
      available: 6,
    },
    {
      day: "Friday",
      scheduled: 26,
      available: 18,
    },
  ];

  const isScheduled = view === "scheduled";

  return (
    <div className="flex h-[440px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Weekly Class Overview
          </h2>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Classes and available scheduling slots from Monday to Friday
          </p>
        </div>

        {/* Current Total */}
        <div className="hidden rounded-xl bg-slate-50 px-4 py-2.5 sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            This Week
          </p>

          <p className="mt-0.5 text-lg font-bold text-[#173B2F]">
            {data.reduce(
              (total, item) =>
                total + (isScheduled ? item.scheduled : item.available),
              0,
            )}
            <span className="ml-1 text-xs font-medium text-slate-400">
              {isScheduled ? "classes" : "slots"}
            </span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-7 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F8F68" stopOpacity={0.18} />

                <stop offset="100%" stopColor="#4F8F68" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94A3B8",
                fontSize: 12,
                fontWeight: 500,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
              }}
            />

            <Tooltip
              cursor={{
                stroke: "#CBD5E1",
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 8px 25px rgba(15, 23, 42, 0.08)",
                padding: "10px 14px",
              }}
              labelStyle={{
                color: "#475569",
                fontWeight: 600,
                marginBottom: "4px",
              }}
              formatter={(value) => [
                `${value} ${isScheduled ? "classes" : "slots"}`,
                isScheduled ? "Scheduled Classes" : "Available Slots",
              ]}
            />

            {/* Area underneath line */}
            <Area
              type="monotone"
              dataKey={isScheduled ? "scheduled" : "available"}
              stroke="none"
              fill="url(#lineGradient)"
              tooltipType="none"
            />

            {/* Main Line */}
            <Line
              type="monotone"
              dataKey={isScheduled ? "scheduled" : "available"}
              stroke="#4F8F68"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#ffffff",
                stroke: "#4F8F68",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#173B2F",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      {/* Toggle */}
      <div className="mt-5 flex justify-center">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setView("scheduled")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 ${
              isScheduled
                ? "bg-white text-[#173B2F] shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <CalendarDays size={15} />

            <span>Scheduled Classes</span>
          </button>
{/* 
          <button
            onClick={() => setView("available")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 ${
              !isScheduled
                ? "bg-white text-[#173B2F] shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <DoorOpen size={15} />

            <span>Available Slots</span>
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default LineChart;
