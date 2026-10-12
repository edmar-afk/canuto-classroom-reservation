import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  UserRound,
  BookOpen,
  GraduationCap,
  UsersRound,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import api from "../../assets/api";

function AddScheduleModal({
  isOpen,
  onClose,
  onScheduleCreated,
  selectedDate,
}) {
  const [instructors, setInstructors] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    instructor: "",
    course: "",
    year_lvl: "",
    section: "",
    room_name: "",
    start_time: "",
    end_time: "",
  });

  /*
    Load instructors when modal opens.
    
    Change /api/users/ if your actual users endpoint
    has a different URL.
  */
  useEffect(() => {
    if (!isOpen) return;

    const fetchInstructors = async () => {
      try {
        setLoadingInstructors(true);
        setError("");

        const response = await api.get("/api/users/");

        /*
          Handles both:
          - normal array response
          - Django REST Framework pagination
        */
        const users = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        /*
          If your User model has a position field,
          this filters only instructors/teachers.
        */
        const teachers = users.filter(
          (student) =>
            student.user?.is_staff === true &&
            student.user?.is_superuser === false,
        );

        setInstructors(teachers);
      } catch (err) {
        console.error("Failed to load instructors:", err);
        setError("Unable to load instructors.");
      } finally {
        setLoadingInstructors(false);
      }
    };

    fetchInstructors();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.instructor ||
      !formData.course ||
      !formData.year_lvl ||
      !formData.section ||
      !formData.room_name ||
      !formData.start_time ||
      !formData.end_time
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.start_time >= formData.end_time) {
      setError("End time must be later than start time.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post("/api/schedules/", {
        instructor: formData.instructor,
        course: formData.course,
        year_lvl: formData.year_lvl,
        section: formData.section,
        room_name: formData.room_name,
        date: selectedDate,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });

      /*
        Tell the calendar that a new schedule was created.
      */
      if (onScheduleCreated) {
        onScheduleCreated(response.data);
      }

      setFormData({
        instructor: "",
        course: "",
        year_lvl: "",
        section: "",
        date: "",
        start_time: "",
        end_time: "",
      });

      onClose();
    } catch (err) {
      console.error("Failed to create schedule:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to create schedule. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* =========================================
            HEADER
        ========================================= */}
        <div className="flex items-start justify-between bg-[#173B2F] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <CalendarDays size={21} className="text-white" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Add Schedule for{" "}
                {selectedDate &&
                  new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                .
              </h2>

              <p className="mt-0.5 text-xs text-emerald-100/70">
                Create a new class schedule
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-emerald-100/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        {/* =========================================
            FORM
        ========================================= */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(92vh-160px)] overflow-y-auto px-5 py-5 sm:px-6">
            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* =====================================
                  INSTRUCTOR
              ===================================== */}
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Instructor
                </label>

                <div className="relative">
                  <UserRound
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                    disabled={loadingInstructors}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#173B2F]/40 focus:ring-4 focus:ring-[#173B2F]/5 disabled:bg-slate-50"
                  >
                    <option value="">
                      {loadingInstructors
                        ? "Loading instructors..."
                        : "Select instructor"}
                    </option>

                    {instructors.map((teacher) => (
                      <option key={teacher.user.id} value={teacher.user.id}>
                        {teacher.full_name ||
                          `${teacher.user.first_name || ""} ${
                            teacher.user.last_name || ""
                          }`.trim() ||
                          teacher.user.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* =====================================
                  COURSE
              ===================================== */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Course
                  </label>

                  <div className="relative">
                    <BookOpen
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#173B2F]/40 focus:ring-4 focus:ring-[#173B2F]/5"
                    >
                      <option value="" disabled>
                        Select course
                      </option>
                      <option value="BSIT">BSIT</option>
                      <option value="BIT">BIT</option>
                      <option value="BTLED-HE">BTLED HE</option>
                      <option value="BTVTED-FSM">BTVTED FSM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Room Name
                  </label>

                  <div className="relative">
                    <BookOpen
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      name="room_name"
                      value={formData.room_name}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#173B2F]/40 focus:ring-4 focus:ring-[#173B2F]/5"
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
              </div>

              {/* =====================================
                  YEAR + SECTION
              ===================================== */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Year Level
                  </label>

                  <div className="relative">
                    <GraduationCap
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      name="year_lvl"
                      value={formData.year_lvl}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#173B2F]/40 focus:ring-4 focus:ring-[#173B2F]/5"
                    >
                      <option value="" disabled>
                        Select year level
                      </option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

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
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#173B2F]/40 focus:ring-4 focus:ring-[#173B2F]/5"
                    >
                      <option value="" disabled>
                        Select section
                      </option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                      <option value="E">Section E</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* =====================================
                  TIME
              ===================================== */}
              <div className="grid gap-4 sm:grid-cols-2">
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
                      value={formData.start_time}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#173B2F]/40 focus:ring-4 focus:ring-[#173B2F]/5"
                    />
                  </div>
                </div>

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
                      value={formData.end_time}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#173B2F]/40 focus:ring-4 focus:ring-[#173B2F]/5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              FOOTER
          ========================================= */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#173B2F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102d23] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddScheduleModal;
