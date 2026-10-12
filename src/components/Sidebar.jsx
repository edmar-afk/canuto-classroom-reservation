import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Database,
  CalendarDays,
  FileText,
  TriangleAlert,
  CalendarCheck,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Building2,
  GraduationCap,
  BookOpen,
  UserRound,
  School,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import api from "../assets/api";

import logo from "../assets/images/logo.jpg";
import footerImg from "../assets/images/schooldraw.png";
import ProfileModal from "./ProfileModal";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser);

      if (!parsed?.user?.id) return;

      const fetchProfile = async () => {
        try {
          const res = await api.get(`/api/profile/${parsed.user.id}/`);
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      };

      fetchProfile();
    } catch (error) {
      console.error("Invalid user data:", error);
    }
  }, []);

  const isSuperUser =
    user?.user?.is_superuser === true || user?.user?.is_superuser === "true";

  const currentPath = location.pathname;

  const isActive = (path) => {
    return currentPath === path;
  };

  const navigateTo = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItemClass = (active = false) =>
    `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-[#65B765] text-white shadow-sm"
        : "text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  const sidebarContent = (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#246B4F] text-white">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <div className="relative z-20 px-5 pb-5 pt-5">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-white shadow-sm">
            <img
              src={logo}
              alt="Smart Scheduling System"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Brand */}
          <div className="min-w-0">
            <h1 className="text-[15px] font-bold leading-tight tracking-tight text-white">
              Smart Scheduling
            </h1>

            <p className="text-[15px] font-bold leading-tight tracking-tight text-white">
              System
            </p>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* NAVIGATION */}
      {/* ========================================= */}
      <nav className="relative z-20 flex-1 overflow-y-auto px-3 pb-32 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <div className="space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => navigateTo("/dashboard")}
            className={menuItemClass(isActive("/dashboard"))}
          >
            <LayoutDashboard size={21} strokeWidth={1.8} className="shrink-0" />

            <span>Dashboard</span>
          </button>

          {/* Schedules */}
          <button
            onClick={() => navigateTo("/calendar")}
            className={menuItemClass(isActive("/calendar"))}
          >
            <CalendarCheck size={21} strokeWidth={1.8} className="shrink-0" />

            <span>Schedules</span>
          </button>

          {/* Conflict Monitoring */}
          {/* <button
            onClick={() => navigateTo("/conflicts")}
            className={menuItemClass(isActive("/conflicts"))}
          >
            <TriangleAlert size={21} strokeWidth={1.8} className="shrink-0" />

            <span>Conflict Reports</span>
          </button> */}

          {/* Users */}
          <button
            onClick={() => navigateTo("/users")}
            className={menuItemClass(isActive("/users"))}
          >
            <UserRound size={21} strokeWidth={1.8} className="shrink-0" />

            <span>Users</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => navigateTo("/settings")}
            className={menuItemClass(isActive("/settings"))}
          >
            <Settings size={21} strokeWidth={1.8} className="shrink-0" />

            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* ========================================= */}
      {/* SCHOOL FOOTER IMAGE */}
      {/* ========================================= */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-48 overflow-hidden">
        <img
          src={footerImg}
          alt=""
          className="absolute bottom-0 left-0 h-full w-full object-cover object-bottom "
        />

        {/* Fade gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#174D3A] via-[#246B4F]/70 to-transparent" />
      </div>

      {/* ========================================= */}
      {/* USER FOOTER */}
      {/* ========================================= */}
      <div className="relative z-30 border-t border-white/10 bg-[#1D5B43]/95 px-5 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Profile */}
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white">
            <img
              src={
                user?.student?.profile_picture
                  ? `${import.meta.env.VITE_API_URL}${user.student.profile_picture}`
                  : logo
              }
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>

          {/* User Info */}
          <button
            onClick={() => setProfileOpen(true)}
            className="min-w-0 flex-1 text-left"
          >
            <p className="truncate text-sm font-bold text-white">
              {user?.student?.full_name || "Instructor"}
            </p>

            <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-white/65">
              {isSuperUser
                ? "System Administrator"
                : "Campus Academic Programs Coordinator"}
            </p>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={19} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ========================================= */}
      {/* MOBILE TOP BAR */}
      {/* ========================================= */}
      <div className="fixed left-0 right-0 top-0 z-[1200] flex h-16 items-center bg-[#246B4F] px-4 shadow-md md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
        >
          <Menu size={24} />
        </button>

        <div className="ml-3 flex items-center gap-2">
          <div className="h-9 w-9 overflow-hidden rounded-full border border-white bg-white">
            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
          </div>

          <div>
            <p className="text-sm font-bold leading-tight text-white">
              Smart Scheduling
            </p>

            <p className="text-[11px] text-white/70">System</p>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MOBILE OVERLAY */}
      {/* ========================================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[1300] bg-black/40 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ========================================= */}
      {/* SIDEBAR */}
      {/* ========================================= */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-[1400] w-[240px] shadow-2xl transition-transform duration-300 ease-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 md:hidden"
        >
          <X size={19} />
        </button>

        {sidebarContent}
      </aside>

      {/* Profile Modal */}
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />
    </>
  );
}

export default Sidebar;
