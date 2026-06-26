import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Table from "../components/rooms/Table";
import VillaIcon from "@mui/icons-material/Villa";
import api from "../assets/api";

function Rooms() {
  const [data, setData] = useState(null);

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
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const userId = data?.user?.id;
  const fullName = data?.student?.full_name;

  console.log("Full Name in Rooms.jsx:", fullName);
  console.log("User ID in Rooms.jsx:", userId);

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar user={data} />

      <div className="-ml-8 sm:ml-64 flex-1 p-1 sm:p-6">
        <div className="flex flex-row items-center gap-2 mt-24 sm:mt-0">
          <VillaIcon className="text-blue-500" fontSize="large" />
          <p className="font-bold text-2xl">Rooms</p>
        </div>

        <Table fullName={fullName} userId={userId} />
      </div>
    </div>
  );
}

export default Rooms;
