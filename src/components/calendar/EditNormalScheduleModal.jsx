import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  Loader2,
  CalendarDays,
  Clock3,
  DoorOpen,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import api from "../../assets/api";

function EditNormalScheduleModal({
  isOpen,
  onClose,
  schedule,
  onUpdated,
}) {
  const [form, setForm] = useState({
    course: "",
    year_lvl: "",
    section: "",
    room_name: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!schedule) return;

    setForm({
      course: schedule.course || "",
      year_lvl: schedule.year_lvl || "",
      section: schedule.section || "",
      room_name: schedule.room_name || schedule.room || "",
      date: schedule.date || "",
      start_time:
        schedule.start_time?.slice(0, 5) ||
        schedule.start ||
        "",
      end_time:
        schedule.end_time?.slice(0, 5) ||
        schedule.end ||
        "",
    });

    setError("");
  }, [schedule]);

  if (!isOpen || !schedule) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const payload = {
        course: form.course,
        year_lvl: form.year_lvl,
        section: form.section,
        room_name: form.room_name,
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
      };

      const response = await api.patch(
        `/api/schedules/${schedule.id}/`,
        payload,
      );

      onUpdated(response.data);
      onClose();
    } catch (err) {
      console.error("Failed to update schedule:", err);

      const message = err.response?.data
        ? Object.values(err.response.data)
            .flat()
            .join(" ")
        : "Failed to update schedule.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#173B2F]">
              Edit Schedule
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-800">
              Update Class Schedule
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              Schedule ID #{schedule.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Course */}
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Course
            </label>

            <div className="relative">
              <GraduationCap
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="course"
                value={form.course}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#173B2F] focus:bg-white focus:ring-2 focus:ring-[#173B2F]/10"
                placeholder="Course name"
              />
            </div>
          </div>

          {/* Year + Section */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Year */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Year Level
              </label>

              <select
                name="year_lvl"
                value={form.year_lvl}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#173B2F] focus:bg-white focus:ring-2 focus:ring-[#173B2F]/10"
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Section
              </label>

              <div className="relative">
                <UsersRound
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#173B2F] focus:bg-white focus:ring-2 focus:ring-[#173B2F]/10"
                >
                  <option value="">Select section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                  <option value="E">Section E</option>
                </select>
              </div>
            </div>
          </div>

          {/* Room */}
          <div className="mt-4">
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Room
            </label>

            <div className="relative">
              <DoorOpen
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                name="room_name"
                value={form.room_name}
                onChange={handleChange}
                required
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#173B2F] focus:bg-white focus:ring-2 focus:ring-[#173B2F]/10"
              >
                <option value="">Select a room</option>
                <option value="Room 301">Room 301</option>
                <option value="Room 302">Room 302</option>
                <option value="Room 303">Room 303</option>
                <option value="Room 304">Room 304</option>
                <option value="Room 305">Room 305</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="mt-4">
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Date
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#173B2F] focus:bg-white focus:ring-2 focus:ring-[#173B2F]/10"
              />
            </div>
          </div>

          {/* Time */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Start */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Start Time
              </label>

              <div className="relative">
                <Clock3
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="time"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#173B2F] focus:bg-white focus:ring-2 focus:ring-[#173B2F]/10"
                />
              </div>
            </div>

            {/* End */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                End Time
              </label>

              <div className="relative">
                <Clock3
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="time"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#173B2F] focus:bg-white focus:ring-2 focus:ring-[#173B2F]/10"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173B2F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f2d23] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditNormalScheduleModal;