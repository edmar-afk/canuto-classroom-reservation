/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  UserRound,
  BookOpen,
  GraduationCap,
  UsersRound,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import api from "../../assets/api";
import AddScheduleModal from "./AddScheduleModal";
import EditScheduleModal from "./EditScheduleModal";
import EditNormalScheduleModal from "./EditNormalScheduleModal";

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

const pad = (number) => String(number).padStart(2, "0");

const formatDateKey = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
};

const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Monday = 0, Sunday = 6
  const firstDayIndex = (firstDay.getDay() + 6) % 7;

  for (let i = firstDayIndex; i > 0; i--) {
    const date = new Date(year, month, 1 - i);
    days.push({
      date,
      currentMonth: false,
    });
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  const remaining = 42 - days.length;

  for (let day = 1; day <= remaining; day++) {
    days.push({
      date: new Date(year, month + 1, day),
      currentMonth: false,
    });
  }

  return days;
};

/* ---------------------------------------------
   Schedule styling
--------------------------------------------- */

const eventTypeStyles = {
  academic: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
  },
};

/* ---------------------------------------------
   Calendar
--------------------------------------------- */

function CalendarView() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [selectedDate, setSelectedDate] = useState(today);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const selectedDateKey = formatDateKey(selectedDate);

  const [showAddModal, setShowAddModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [normalEditingSchedule, setNormalEditingSchedule] = useState(null);
  const [normalEditModalOpen, setNormalEditModalOpen] = useState(false);

  // Staff and superusers can add schedules.
  const [canManageSchedules, setCanManageSchedules] = useState(false);

  // Only superusers can edit, delete, or fix room conflicts.
  const [isSuperUser, setIsSuperUser] = useState(false);

  /* ---------------------------------------------
     Read logged-in user permissions
  --------------------------------------------- */

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setCanManageSchedules(false);
        setIsSuperUser(false);
        return;
      }

      const parsed = JSON.parse(storedUser);

      // Supports either a directly stored user or an object containing user.
      const loggedInUser = parsed?.user ?? parsed;

      const superuser =
        loggedInUser?.is_superuser === true ||
        loggedInUser?.is_superuser === "true";

      const staff =
        loggedInUser?.is_staff === true ||
        loggedInUser?.is_staff === "true";

      setIsSuperUser(superuser);
      setCanManageSchedules(superuser || staff);
    } catch (error) {
      console.error("Failed to read user permissions:", error);
      setCanManageSchedules(false);
      setIsSuperUser(false);
    }
  }, []);

  /* ---------------------------------------------
     Fetch schedules
  --------------------------------------------- */

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/schedules/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setSchedules(data);
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setError("Unable to load schedules.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  /* ---------------------------------------------
     Convert Django schedules into calendar events
  --------------------------------------------- */

  const events = useMemo(() => {
    return schedules.map((schedule) => ({
      id: schedule.id,
      title: schedule.course || "Scheduled Class",
      date: schedule.date,
      start: schedule.start_time?.slice(0, 5) || "",
      end: schedule.end_time?.slice(0, 5) || "",
      room: schedule.room_name || "N/A",
      instructor: schedule.instructor_name || "Unknown Instructor",
      course: schedule.course || "N/A",
      year_lvl: schedule.year_lvl || "N/A",
      section: schedule.section || "N/A",
      type: "academic",
    }));
  }, [schedules]);

  const timeToMinutes = (time) => {
    if (!time) return 0;

    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  /* ---------------------------------------------
     Detect room conflicts
  --------------------------------------------- */

  const hasRoomConflict = (event) => {
    return events.some((other) => {
      // Do not compare the event with itself.
      if (other.id === event.id) return false;

      // Schedules must be on the same date.
      if (other.date !== event.date) return false;

      // Both schedules must have a valid room.
      if (
        !event.room ||
        !other.room ||
        event.room === "N/A" ||
        other.room === "N/A"
      ) {
        return false;
      }

      // Schedules must use the same room.
      if (event.room !== other.room) return false;

      const eventStart = timeToMinutes(event.start);
      const eventEnd = timeToMinutes(event.end);
      const otherStart = timeToMinutes(other.start);
      const otherEnd = timeToMinutes(other.end);

      // Time ranges overlap.
      return eventStart < otherEnd && eventEnd > otherStart;
    });
  };

  /* ---------------------------------------------
     Selected day events
  --------------------------------------------- */

  const selectedEvents = events
    .filter((event) => event.date === selectedDateKey)
    .sort((a, b) => a.start.localeCompare(b.start));

  /* ---------------------------------------------
     Calendar navigation
  --------------------------------------------- */

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();

    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  /* ---------------------------------------------
     Calendar helpers
  --------------------------------------------- */

  const monthTitle = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const getEventsForDate = (date) => {
    const key = formatDateKey(date);

    return events
      .filter((event) => event.date === key)
      .sort((a, b) => a.start.localeCompare(b.start));
  };

  const isToday = (date) => {
    return formatDateKey(date) === formatDateKey(today);
  };

  const isSelected = (date) => {
    return formatDateKey(date) === selectedDateKey;
  };

  const monthEventCount = events.filter((event) => {
    const eventDate = new Date(`${event.date}T00:00:00`);

    return (
      eventDate.getMonth() === month &&
      eventDate.getFullYear() === year
    );
  }).length;

  /* ---------------------------------------------
     Add schedule
  --------------------------------------------- */

  const openAddSchedule = () => {
    // Only staff and superusers may add schedules.
    if (!canManageSchedules) return;

    setScheduleDate(formatDateKey(selectedDate));
    setShowAddModal(true);
  };

  const closeAddSchedule = () => {
    setShowAddModal(false);
  };

  const handleScheduleCreated = () => {
    fetchSchedules();
  };

  /* ---------------------------------------------
     Edit schedule / fix room conflict
  --------------------------------------------- */

  const openEditSchedule = (event) => {
    // Superuser-only action.
    if (!isSuperUser) return;

    const originalSchedule = schedules.find(
      (schedule) => schedule.id === event.id,
    );

    if (!originalSchedule) return;

    setEditingSchedule(originalSchedule);
    setEditModalOpen(true);
  };

  const closeEditSchedule = () => {
    setEditModalOpen(false);
    setEditingSchedule(null);
  };

  /* ---------------------------------------------
     Delete schedule
  --------------------------------------------- */

  const handleDeleteSchedule = async (event) => {
    // Superuser-only action.
    if (!isSuperUser) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.course}"?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/api/schedules/${event.id}/delete/`);

      setSchedules((prev) =>
        prev.filter((schedule) => schedule.id !== event.id),
      );
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      alert("Failed to delete schedule. Please try again.");
    }
  };

  /* ---------------------------------------------
     Edit normal schedule
  --------------------------------------------- */

  const openNormalEditSchedule = (event) => {
    // Superuser-only action.
    if (!isSuperUser) return;

    const originalSchedule = schedules.find(
      (schedule) => schedule.id === event.id,
    );

    if (!originalSchedule) return;

    setNormalEditingSchedule(originalSchedule);
    setNormalEditModalOpen(true);
  };

  const closeNormalEditSchedule = () => {
    setNormalEditModalOpen(false);
    setNormalEditingSchedule(null);
  };

  /* ---------------------------------------------
     Render calendar
  --------------------------------------------- */

  return (
    <div className="space-y-5">
      {/* Calendar header */}
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173B2F]/10">
              <CalendarDays size={21} className="text-[#173B2F]" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Scheduled Calendar
              </h2>

              <p className="text-xs text-slate-400">
                View and manage scheduled classes
              </p>
            </div>
          </div>

          {/* Navigation and Add Schedule */}
          <div className="flex flex-wrap items-center gap-2">
            {canManageSchedules && (
              <button
                type="button"
                onClick={openAddSchedule}
                className="flex items-center gap-2 rounded-xl bg-[#173B2F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102d23]"
              >
                <Plus size={16} />
                Add Schedule for{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </button>
            )}

            <button
              type="button"
              onClick={goToToday}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#173B2F]/20 hover:bg-slate-50"
            >
              Today
            </button>

            <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="flex h-10 w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-[#173B2F]"
              >
                <ChevronLeft size={19} />
              </button>

              <button
                type="button"
                onClick={goToNextMonth}
                className="flex h-10 w-10 items-center justify-center border-l border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-[#173B2F]"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Calendar and day details */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main calendar */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Month */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                {monthTitle}
              </h3>

              <p className="mt-0.5 text-xs text-slate-400">
                {loading
                  ? "Loading schedules..."
                  : `${monthEventCount} scheduled ${
                      monthEventCount === 1 ? "class" : "classes"
                    }`}
              </p>
            </div>

            <div className="flex flex-row gap-8">
              <div className="hidden items-center gap-4 text-xs sm:flex">
                <Legend color="bg-blue-500" label="Scheduled Classes" />
              </div>

              <div className="hidden items-center gap-4 text-xs sm:flex">
                <Legend color="bg-red-500" label="Conflict Classes" />
              </div>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <div
                key={day}
                className="border-r border-slate-100 px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 last:border-r-0 sm:text-xs"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.substring(0, 2)}</span>
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {days.map(({ date, currentMonth }, index) => {
              const dayEvents = getEventsForDate(date);
              const todayCell = isToday(date);
              const selectedCell = isSelected(date);

              return (
                <button
                  type="button"
                  key={`${formatDateKey(date)}-${index}`}
                  onClick={() => setSelectedDate(date)}
                  className={`group relative min-h-[105px] border-b border-r border-slate-100 p-1.5 text-left transition sm:min-h-[125px] sm:p-2 ${
                    !currentMonth
                      ? "bg-slate-50/50"
                      : "bg-white hover:bg-slate-50"
                  } ${
                    selectedCell
                      ? "z-10 ring-2 ring-inset ring-[#173B2F]/30"
                      : ""
                  }`}
                >
                  {/* Date number */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition ${
                        todayCell
                          ? "bg-[#173B2F] text-white shadow-sm"
                          : selectedCell
                            ? "bg-[#173B2F]/10 text-[#173B2F]"
                            : currentMonth
                              ? "text-slate-700"
                              : "text-slate-300"
                      }`}
                    >
                      {date.getDate()}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="mr-1 text-[9px] font-semibold text-slate-300">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Events */}
                  <div className="mt-1.5 space-y-1">
                    {dayEvents.slice(0, 3).map((event) => {
                      const styles = eventTypeStyles.academic;
                      const conflict = hasRoomConflict(event);

                      return (
                        <div
                          key={event.id}
                          className={`flex items-center gap-1.5 truncate rounded-md border px-1.5 py-1 text-[9px] font-semibold transition ${
                            conflict
                              ? "animate-pulse border-red-400 bg-red-50 text-red-700 shadow-[0_0_10px_rgba(239,68,68,0.45)]"
                              : styles.badge
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              conflict ? "bg-red-500" : styles.dot
                            }`}
                          />
                          <span className="truncate">{event.course}</span> -{" "}
                          {event.room}
                        </div>
                      );
                    })}

                    {dayEvents.length > 3 && (
                      <p className="px-1 text-[9px] font-semibold text-[#173B2F]">
                        +{dayEvents.length - 3} more
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected day */}
        <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Selected day header */}
          <div
            className={`px-5 py-5 transition ${
              selectedEvents.some((event) => hasRoomConflict(event))
                ? "bg-red-600"
                : "bg-[#173B2F]"
            }`}
          >
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                selectedEvents.some((event) => hasRoomConflict(event))
                  ? "text-red-100"
                  : "text-emerald-100/70"
              }`}
            >
              Selected Day
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </h3>

            <p
              className={`mt-0.5 text-xs ${
                selectedEvents.some((event) => hasRoomConflict(event))
                  ? "text-red-100"
                  : "text-emerald-100/70"
              }`}
            >
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </p>

            {/* Conflict warning */}
            {selectedEvents.some((event) => hasRoomConflict(event)) && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-white">
                  Room Schedule Conflict
                </span>
              </div>
            )}
          </div>

          {/* Schedule content */}
          <div className="p-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 size={24} className="animate-spin text-[#173B2F]" />
                <p className="mt-3 text-xs text-slate-400">
                  Loading schedules...
                </p>
              </div>
            ) : selectedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                  <CalendarDays size={21} className="text-slate-300" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  No schedules
                </p>

                <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-400">
                  There are no scheduled classes for this date.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => {
                  const styles = eventTypeStyles.academic;
                  const conflict = hasRoomConflict(event);

                  return (
                    <div
                      key={event.id}
                      className={`rounded-xl border p-4 transition ${
                        conflict
                          ? "animate-pulse border-red-300 bg-red-50 shadow-[0_0_14px_rgba(239,68,68,0.35)]"
                          : "border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Event dot */}
                        <div
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            conflict ? "bg-red-500" : styles.dot
                          }`}
                        />

                        <div className="min-w-0 flex-1">
                          {/* Course name and superuser actions */}
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={`min-w-0 truncate text-sm font-bold ${
                                conflict ? "text-red-700" : "text-slate-800"
                              }`}
                            >
                              {event.course}
                            </h4>

                            {/* Only superusers see Edit and Delete */}
                            {isSuperUser && (
                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    if (conflict) {
                                      openEditSchedule(event);
                                    } else {
                                      openNormalEditSchedule(event);
                                    }
                                  }}
                                  title={
                                    conflict
                                      ? "Fix room conflict"
                                      : "Edit schedule"
                                  }
                                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                                    conflict
                                      ? "text-red-500 hover:bg-red-200 hover:text-red-700"
                                      : "text-slate-400 hover:bg-slate-200 hover:text-[#173B2F]"
                                  }`}
                                >
                                  <Pencil size={14} />
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSchedule(event);
                                  }}
                                  title="Delete schedule"
                                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                                    conflict
                                      ? "text-red-500 hover:bg-red-200 hover:text-red-700"
                                      : "text-slate-400 hover:bg-red-100 hover:text-red-600"
                                  }`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Conflict badge is visible to everyone */}
                          {conflict && (
                            <div className="mt-1.5 inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-red-600">
                              Room Conflict
                            </div>
                          )}

                          {/* Time */}
                          <div
                            className={`mt-3 flex items-center gap-2 text-xs ${
                              conflict
                                ? "font-semibold text-red-600"
                                : "text-slate-500"
                            }`}
                          >
                            <Clock3 size={14} />

                            <span>
                              {new Date(
                                `1970-01-01T${event.start}:00`,
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}{" "}
                              –{" "}
                              {new Date(
                                `1970-01-01T${event.end}:00`,
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          {/* Room */}
                          <div
                            className={`mt-2 flex items-center gap-2 text-xs ${
                              conflict
                                ? "font-semibold text-red-600"
                                : "text-slate-500"
                            }`}
                          >
                            <span
                              className={
                                conflict
                                  ? "font-semibold text-red-400"
                                  : "font-semibold text-slate-400"
                              }
                            >
                              Room:
                            </span>

                            <span>{event.room}</span>
                          </div>

                          {/* Instructor */}
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <UserRound size={14} />
                            <span className="truncate">{event.instructor}</span>
                          </div>

                          {/* Year level */}
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <GraduationCap size={14} />
                            <span>{event.year_lvl}</span>
                          </div>

                          {/* Section */}
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <UsersRound size={14} />
                            <span>Section {event.section}</span>
                          </div>

                          {/* Only superusers can fix room conflicts */}
                          {isSuperUser && conflict && (
                            <button
                              type="button"
                              onClick={() => openEditSchedule(event)}
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-red-600 transition hover:border-red-300 hover:bg-red-100"
                            >
                              <Pencil size={12} />
                              Fix Room Conflict
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Staff and superusers can add schedules */}
            {canManageSchedules && (
              <button
                type="button"
                onClick={openAddSchedule}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-[#173B2F]/30 hover:bg-[#173B2F]/5 hover:text-[#173B2F]"
              >
                <Plus size={16} />
                Add Schedule
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:hidden">
        <Legend color="bg-blue-500" label="Scheduled Class" />
      </div>

      {/* Add schedule modal */}
      <AddScheduleModal
        isOpen={canManageSchedules && showAddModal}
        onClose={closeAddSchedule}
        onScheduleCreated={handleScheduleCreated}
        selectedDate={scheduleDate}
      />

      {/* Edit modal: superuser only */}
      <EditScheduleModal
        isOpen={isSuperUser && editModalOpen}
        onClose={closeEditSchedule}
        schedule={editingSchedule}
        onUpdated={(updatedSchedule) => {
          if (!isSuperUser) return;

          setSchedules((prev) =>
            prev.map((schedule) =>
              schedule.id === updatedSchedule.id ? updatedSchedule : schedule,
            ),
          );
        }}
      />

      {/* Normal edit modal: superuser only */}
      <EditNormalScheduleModal
        isOpen={isSuperUser && normalEditModalOpen}
        onClose={closeNormalEditSchedule}
        schedule={normalEditingSchedule}
        onUpdated={(updatedSchedule) => {
          if (!isSuperUser) return;

          setSchedules((prev) =>
            prev.map((schedule) =>
              schedule.id === updatedSchedule.id ? updatedSchedule : schedule,
            ),
          );
        }}
      />
    </div>
  );
}

/* ---------------------------------------------
   Legend
--------------------------------------------- */

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-[10px] font-semibold text-slate-500">
        {label}
      </span>
    </div>
  );
}

export default CalendarView;