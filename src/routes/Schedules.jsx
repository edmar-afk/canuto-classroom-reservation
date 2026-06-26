import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Table from "../components/schedule/Table";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
function Schedules() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);
  console.log("Schedules user data:", data);
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar user={data} />

      <div className="-ml-8 sm:ml-64 flex-1 p-1 sm:p-6">
        <div className="flex flex-row items-center gap-2 mt-24 sm:mt-0">
          <AccessTimeIcon className="text-blue-500" fontSize="large" />
          <p className="font-bold text-2xl">Your Class Schedules</p>
        </div>
        <Table userInfo={data} />
      </div>
    </div>
  );
}

export default Schedules;
