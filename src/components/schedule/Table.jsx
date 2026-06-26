import React, { useEffect, useState } from "react";
import api from "../../assets/api";

function Table({userInfo}) {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [instructor, setInstructor] = useState(null);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/profile/${storedUser.user.id}/`);
        setInstructor(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  const getReservations = async () => {
    try {
      const res = await api.get("/api/all-reservations/");

      const now = new Date();

      const activeReservations = res.data.filter((item) => {
        const timeOut = new Date(item.time_out);
        return timeOut > now;
      });

      setReservations(activeReservations);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReservations();

    const interval = setInterval(() => {
      getReservations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredData = reservations.filter((item) => {
    const matchRoom = item.room.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchInstructor = instructorName
      ? item.instructor?.full_name?.trim().toLowerCase() ===
        instructorName.trim().toLowerCase()
      : true;

    return matchRoom && matchInstructor;
  });

  const formatDateTime = (value) => {
    return new Date(value).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <p className="mb-4 w-full sm:w-[60%]">
        Expired schedules will not display here to avoid confusions. Newly set
        schedule that is past the current time also not display here.
      </p>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Room Name</th>
              <th className="py-3 px-6 text-left">Student Name</th>
              <th className="py-3 px-6 text-left">Course</th>
              <th className="py-3 px-6 text-left">Year</th>
              <th className="py-3 px-6 text-left">Subject</th>
              <th className="py-3 px-6 text-left">Time In</th>
              <th className="py-3 px-6 text-left">Time Out</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm">
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6">{item.room.name}</td>
                <td className="py-3 px-6">{item.student.full_name}</td>
                <td className="py-3 px-6">{item.course}</td>
                <td className="py-3 px-6">
                  {item.year_lvl} - {item.section}
                </td>
                <td className="py-3 px-6">{item.subject}</td>
                <td className="py-3 px-6">{formatDateTime(item.time_in)}</td>
                <td className="py-3 px-6">{formatDateTime(item.time_out)}</td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No Schedules found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">Showing {filteredData.length} entries</div>
    </div>
  );
}

export default Table;
