import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  Settings,
  LogOut,
  Menu,
  X,
  UserRound,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser);

      // Login saves data.user directly in localStorage.
      // Also supports the older nested user.user structure.
      const loggedInUser = parsed?.user ?? parsed;

      const superuser =
        loggedInUser?.is_superuser === true ||
        loggedInUser?.is_superuser === "true";

      setIsSuperUser(superuser);

      if (!loggedInUser?.id) return;

      const fetchProfile = async () => {
        try {
          const res = await api.get(`/api/profile/${loggedInUser.id}/`);

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

  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
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
      {/* HEADER */}
      <div className="relative z-20 px-5 pb-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-white shadow-sm">
            <img
              src={logo}
              alt="Smart Scheduling System"
              className="h-full w-full object-cover"
            />
          </div>

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

      {/* NAVIGATION */}
      <nav className="relative z-20 flex-1 overflow-y-auto px-3 pb-32 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <div className="space-y-1">
          {/* DASHBOARD — SUPERUSERS ONLY */}
          {isSuperUser && (
            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className={menuItemClass(isActive("/dashboard"))}
            >
              <LayoutDashboard
                size={21}
                strokeWidth={1.8}
                className="shrink-0"
              />
              <span>Dashboard</span>
            </Link>
          )}

          {/* SCHEDULES */}
          <Link
            to="/calendar"
            onClick={closeMobileMenu}
            className={menuItemClass(isActive("/calendar"))}
          >
            <CalendarCheck size={21} strokeWidth={1.8} className="shrink-0" />
            <span>Schedules</span>
          </Link>

          {/* USERS */}
          {isSuperUser && (
            <Link
              to="/users"
              onClick={closeMobileMenu}
              className={menuItemClass(isActive("/users"))}
            >
              <UserRound size={21} strokeWidth={1.8} className="shrink-0" />
              <span>Users</span>
            </Link>
          )}
          {/* SETTINGS */}
          <Link
            to="/settings"
            onClick={closeMobileMenu}
            className={menuItemClass(isActive("/settings"))}
          >
            <Settings size={21} strokeWidth={1.8} className="shrink-0" />
            <span>Settings</span>
          </Link>
        </div>
      </nav>

      {/* SCHOOL FOOTER IMAGE */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-48 overflow-hidden">
        <img
          src={footerImg}
          alt=""
          className="absolute bottom-0 left-0 h-full w-full object-cover object-bottom"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#174D3A] via-[#246B4F]/70 to-transparent" />
      </div>

      {/* USER FOOTER */}
      <div className="relative z-30 border-t border-white/10 bg-[#1D5B43]/95 px-5 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* PROFILE PICTURE */}
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

          {/* USER INFORMATION */}
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="min-w-0 flex-1 text-left"
          >
            <p className="truncate text-sm font-bold text-white">
              {user?.student?.full_name ||
                user?.user?.username ||
                user?.username ||
                "Instructor"}
            </p>

            <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-white/65">
              {isSuperUser
                ? "System Administrator"
                : "Campus Academic Programs Coordinator"}
            </p>
          </button>

          {/* LOGOUT */}
          <button
            type="button"
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
      {/* MOBILE TOP BAR */}
      <div className="fixed left-0 right-0 top-0 z-[1200] flex h-16 items-center bg-[#246B4F] px-4 shadow-md md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
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

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[1300] bg-black/40 backdrop-blur-[2px] md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-[1400] w-[240px] shadow-2xl transition-transform duration-300 ease-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* MOBILE CLOSE */}
        <button
          type="button"
          onClick={closeMobileMenu}
          aria-label="Close menu"
          className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 md:hidden"
        >
          <X size={19} />
        </button>

        {sidebarContent}
      </aside>

      {/* PROFILE MODAL */}
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />
    </>
  );
}

export default Sidebar;
