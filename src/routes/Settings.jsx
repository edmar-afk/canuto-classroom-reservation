/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../assets/api";
import ProfileSettings from "../components/settings/ProfileSettings";
import { Settings as SettingsIcon } from "lucide-react";
function Settings() {
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const stored = localStorage.getItem("user");

        console.log("Stored user:", stored);

        if (!stored) {
          console.error("No user found in localStorage.");
          return;
        }

        const parsed = JSON.parse(stored);
        console.log("Parsed user:", parsed);

        // Support either { user: { id } } or { id }
        const userId = parsed?.user?.id ?? parsed?.id;

        if (!userId) {
          console.error("User ID not found in localStorage:", parsed);
          return;
        }

        console.log("Fetching profile for user ID:", userId);

        const res = await api.get(`/api/profile/${userId}/`);

        console.log("FULL PROFILE RESPONSE:", res.data);

        setData(res.data);
      } catch (error) {
        console.error(
          "Failed to fetch profile:",
          error.response?.data || error.message,
        );
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={data} />

      {/* Main Content */}
      <main className="min-h-screen sm:ml-64">
        <div className="px-4 pb-8 pt-24 sm:px-6 sm:pt-6 lg:px-10">
          {/* Dashboard Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173B2F] shadow-sm">
                  <SettingsIcon className="text-white" size={21} />
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Settings
                  </h1>

                  <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                    Manage your profile and account security
                  </p>
                </div>
              </div>
            </div>

            {/* Current Date */}
            <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm sm:flex">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Today
                </p>

                <p className="text-sm font-semibold text-slate-700">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <section>
            <ProfileSettings
              data={data}
              onProfileUpdate={(updatedProfile) => {
                setData(updatedProfile);
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Settings;
