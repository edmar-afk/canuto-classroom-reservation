import React, { useEffect, useState } from "react";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import api from "../../assets/api";
import searchImg from "../../assets/images/search.png";

function RoomLists({ selectedRoom }) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = async () => {
    try {
      const res = await api.get("/api/all-reservations/");
      setReservations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const now = new Date();

  const filteredReservations = reservations
    .filter((item) => item.room.id === Number(selectedRoom))
    .filter((item) => new Date(item.time_out) >= now)
    .sort((a, b) => new Date(a.time_in) - new Date(b.time_in));

  if (!selectedRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-96 mt-10">
        <img src={searchImg} alt="search" className="w-52 opacity-80" />
        <p className="text-gray-400 mt-3 font-medium">
          Please select a room first
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid md:grid-cols-1 gap-10 mt-10 overflow-y-auto h-96 pr-2">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((item) => (
            <div key={item.id} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="text-blue-600 bg-blue-500/10 p-3 rounded-full">
                  <HomeWorkIcon />
                </div>

                <p className="text-xs text-blue-400">{item.year_lvl}</p>
                <p className="text-xs text-blue-400">- {item.section}</p>
              </div>

              <div className="w-full">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xl">{item.room.name}</h3>

                  <p className="text-blue-500 text-xs font-bold">
                    {formatDate(item.reserve_date)} - in:{" "}
                    {formatTime(item.time_in)} - out:{" "}
                    {formatTime(item.time_out)}
                  </p>
                </div>

                <p className="mt-1 text-gray-500">
                  Instructor <b>{item.student.full_name}</b> has scheduled{" "}
                  <b>{item.room.name}</b> for <b>{item.course}</b> students in
                  their <b>{item.subject}</b> class.
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-96">
            <img src={searchImg} alt="search" className="w-52 opacity-80" />
            <p className="text-gray-400 mt-3 font-medium">
              No upcoming schedules found for this room
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomLists;
