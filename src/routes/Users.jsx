import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UsersTable from "../components/users/UsersTable";
import api from "../assets/api";
import { Users as UsersIcon } from "lucide-react";

function Users() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------
     Load logged-in user's profile
     Used by Sidebar
  --------------------------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const userId = parsed?.user?.id;

      if (!userId) return;

      const fetchProfile = async () => {
        try {
          const res = await api.get(`/api/profile/${userId}/`);

          setData(res.data);
        } catch (error) {
          console.log("Failed to load profile:", error);
        }
      };

      fetchProfile();
    } catch (error) {
      console.error("Invalid user data:", error);
    }
  }, []);

  /* ---------------------------------------------
     Load all users
  --------------------------------------------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/users/");

      console.log("USERS API RESPONSE:", response.data);

      const userData = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      // Exclude admin/superuser accounts
      const filteredUsers = userData.filter(
        (user) => user.user?.is_superuser !== true,
      );

      console.log("USER DATA:", filteredUsers);

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------------------------------------------
     Delete user
  --------------------------------------------- */
  const handleDeleteUser = async (user) => {
    if (!user?.id) return;

    try {
      await api.delete(`/api/users/${user.id}/`);

      // Remove immediately from the table
      setUsers((currentUsers) =>
        currentUsers.filter((item) => item.id !== user.id),
      );
    } catch (error) {
      console.error("Failed to delete user:", error);

      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={data} />

      {/* Main Content */}
      <main className="min-h-screen sm:ml-64">
        <div className="px-4 pb-8 pt-24 sm:px-6 sm:pt-6 lg:px-10">
          {/* -----------------------------------------
              PAGE HEADER
          ----------------------------------------- */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173B2F] shadow-sm">
                  <UsersIcon className="text-white" size={21} />
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Users
                  </h1>

                  <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                    Manage and monitor registered users
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

          {/* -----------------------------------------
              USERS TABLE
          ----------------------------------------- */}
          {loading ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
              <div className="flex flex-col items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#173B2F]" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading users...
                </p>
              </div>
            </section>
          ) : (
            <UsersTable
              users={users}
              onDelete={handleDeleteUser}
              onRefresh={fetchUsers}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Users;
