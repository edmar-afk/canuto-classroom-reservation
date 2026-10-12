import React, { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Trash2,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import AddTeacherModal from "./AddTeacherModal";

function UsersTable({ users = [], onDelete, onRefresh }) {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const [showFilters, setShowFilters] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteUser || deleting) return;

    try {
      setDeleting(true);

      await onDelete?.(deleteUser);

      setDeleteUser(null);
    } catch (error) {
      console.error("Delete user failed:", error);
    } finally {
      setDeleting(false);
    }
  };
  /* ---------------------------------------------
     Get unique filter values
  --------------------------------------------- */

  const courses = useMemo(() => {
    return [
      ...new Set(users.map((user) => user.course).filter(Boolean)),
    ].sort();
  }, [users]);

  const sections = useMemo(() => {
    return [
      ...new Set(users.map((user) => user.section).filter(Boolean)),
    ].sort();
  }, [users]);

  const yearLevels = useMemo(() => {
    return [
      ...new Set(users.map((user) => user.year_lvl).filter(Boolean)),
    ].sort();
  }, [users]);

  /* ---------------------------------------------
     Get roles from is_staff
  --------------------------------------------- */

  const roles = ["Teacher", "Student"];

  /* ---------------------------------------------
     Filter users
  --------------------------------------------- */

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((user) => {
      const fullName =
        user.full_name ||
        user.name ||
        `${user.user?.first_name || ""} ${user.user?.last_name || ""}`.trim();

      const username = user.user?.username || "";
      const email = user.user?.email || "";

      const role = user.user?.is_staff ? "Teacher" : "Student";

      const matchesSearch =
        !keyword ||
        fullName.toLowerCase().includes(keyword) ||
        username.toLowerCase().includes(keyword) ||
        email.toLowerCase().includes(keyword) ||
        String(user.course || "")
          .toLowerCase()
          .includes(keyword) ||
        String(user.section || "")
          .toLowerCase()
          .includes(keyword) ||
        role.toLowerCase().includes(keyword);

      const matchesCourse =
        courseFilter === "All" || user.course === courseFilter;

      const matchesSection =
        sectionFilter === "All" || user.section === sectionFilter;

      const matchesYear =
        yearFilter === "All" || String(user.year_lvl) === String(yearFilter);

      const matchesRole = roleFilter === "All" || role === roleFilter;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesSection &&
        matchesYear &&
        matchesRole
      );
    });
  }, [users, search, courseFilter, sectionFilter, yearFilter, roleFilter]);

  /* ---------------------------------------------
     Helpers
  --------------------------------------------- */

  const getFullName = (user) => {
    if (user.full_name) return user.full_name;
    if (user.name) return user.name;

    return (
      `${user.user?.first_name || ""} ${user.user?.last_name || ""}`.trim() ||
      "Unknown User"
    );
  };

  const getInitials = (user) => {
    const name = getFullName(user);

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getProfilePicture = (user) => {
    return user.profile_picture || user.profile_image || user.avatar || null;
  };

  const getRole = (user) => {
    return user.user?.is_staff ? "Teacher" : "Student";
  };

  const clearFilters = () => {
    setSearch("");
    setCourseFilter("All");
    setSectionFilter("All");
    setYearFilter("All");
    setRoleFilter("All");
  };

  const hasActiveFilters =
    search ||
    courseFilter !== "All" ||
    sectionFilter !== "All" ||
    yearFilter !== "All" ||
    roleFilter !== "All";

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* HEADER */}
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "User" : "Users"}
              </span>

              <AddTeacherModal
                onCreated={() => {
                  onRefresh?.();
                }}
              />
            </div>
          </div>

          {/* SEARCH */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#173B2F] focus:bg-white focus:ring-4 focus:ring-[#173B2F]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                showFilters || hasActiveFilters
                  ? "border-[#173B2F]/20 bg-[#173B2F]/5 text-[#173B2F]"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#173B2F] px-1.5 text-[10px] font-bold text-white">
                  !
                </span>
              )}
              <ChevronDown
                size={15}
                className={`transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* FILTERS */}
          {showFilters && (
            <div className="mt-4 grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <FilterSelect
                label="Course"
                value={courseFilter}
                onChange={setCourseFilter}
                options={courses}
              />

              <FilterSelect
                label="Section"
                value={sectionFilter}
                onChange={setSectionFilter}
                options={sections}
              />

              <FilterSelect
                label="Year Level"
                value={yearFilter}
                onChange={setYearFilter}
                options={yearLevels}
              />

              <FilterSelect
                label="Role"
                value={roleFilter}
                onChange={setRoleFilter}
                options={roles}
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-left text-xs font-semibold text-red-500 hover:text-red-600 sm:col-span-2 lg:col-span-4"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  User
                </th>

                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Course
                </th>

                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Section
                </th>

                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Year Level
                </th>

                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Role
                </th>

                <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const profilePicture = getProfilePicture(user);

                  const role = getRole(user);

                  return (
                    <tr
                      key={user.id}
                      className="group transition hover:bg-slate-50/70"
                    >
                      {/* USER */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#173B2F] text-sm font-bold text-white">
                            {profilePicture ? (
                              <img
                                src={profilePicture}
                                alt={getFullName(user)}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(user)
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">
                              {getFullName(user)}
                            </p>

                            {user.user?.username && (
                              <p className="mt-0.5 truncate text-xs text-slate-400">
                                @{user.user.username}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* COURSE */}
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-slate-600">
                          {user.course || "—"}
                        </span>
                      </td>

                      {/* SECTION */}
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-slate-600">
                          {user.section || "—"}
                        </span>
                      </td>

                      {/* YEAR */}
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {user.year_lvl ? `Year ${user.year_lvl}` : "—"}
                        </span>
                      </td>

                      {/* ROLE / IS STAFF */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            user.user?.is_staff
                              ? "bg-[#173B2F]/10 text-[#173B2F]"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {role}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteUser(user)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      {hasActiveFilters ? (
                        <Search size={21} />
                      ) : (
                        <User size={21} />
                      )}
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-slate-700">
                      {hasActiveFilters ? "No users found" : "No users yet"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {hasActiveFilters
                        ? "Try adjusting your search or filters."
                        : "Registered users will appear here."}
                    </p>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 text-xs font-semibold text-[#173B2F] hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* DELETE MODAL */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <Trash2 size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900">Delete User?</h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-700">
                      {getFullName(deleteUser)}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteUser(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={15} />

                {deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-xs font-medium text-slate-600 outline-none transition focus:border-[#173B2F] focus:ring-4 focus:ring-[#173B2F]/10"
        >
          <option value="All">All {label}</option>

          {options.map((option) => (
            <option key={String(option)} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}

export default UsersTable;
