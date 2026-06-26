import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Welcome from "../components/dashboard/Welcome";
import Calendar from "../components/dashboard/Calendar";
import RoomCards from "../components/dashboard/RoomCards";
import api from "../assets/api";

function Dashboard() {
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) return;

    const parsed = JSON.parse(stored);
    const userId = parsed?.user?.id;

    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/profile/${userId}/`);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  const course = data?.student?.course;
  const year_lvl = data?.student?.year_lvl;
  const section = data?.student?.section;

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar user={data} />

      <div className="-ml-8 sm:ml-64 flex-1 p-1 sm:p-6">
        <div className="flex flex-row items-center gap-2 mt-24 sm:mt-0">
          <DashboardIcon className="text-blue-500" fontSize="large" />
          <p className="font-bold text-2xl">Dashboard</p>
        </div>

        <div className="mt-4 sm:mt-14 grid grid-cols-1 lg:grid-cols-[70%_30%] gap-12">
          <div>
            <Welcome />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4 mt-4">
              <RoomCards
                course={course}
                year_lvl={year_lvl}
                section={section}
                selectedDate={selectedDate}
              />
            </div>
          </div>

          <div className="relative sm:sticky sm:top-6 sm:self-start">
            <Calendar
              course={course}
              year_lvl={year_lvl}
              section={section}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
