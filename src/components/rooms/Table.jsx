import React, { useEffect, useState } from "react";
import api from "../../assets/api";
import BookRoomModal from "./BookRoomModal";
import Swal from "sweetalert2";

function Table({ fullName, userId }) {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");

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

  const handleCancel = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Cancel Class schedule?",
        text: "This schedule will be permanently cancelled.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it",
      });

      if (!result.isConfirmed) return;

      await api.delete(`/api/reservation/delete/${id}/`);

      Swal.fire({
        title: "Cancelled",
        text: "Class schedule cancelled successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      getReservations();
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "Failed to cancel class schedule. Please try again.",
        icon: "error",
      });
    }
  };

  const filteredData = reservations.filter((item) =>
    item.room.name.toLowerCase().includes(search.toLowerCase()),
  );

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
    <div>
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

          <BookRoomModal fullName={fullName} userId={userId} />
        </div>

        <p className="mb-4 w-full sm:w-[60%]">
          Expired schedules will not display here to avoid confusions. Newly set
          schedule that is past the current time also not display here, set
          schedule carefully.
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
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="text-gray-600 text-sm">
              {filteredData.map((item) => {
                const canCancel =
                  fullName &&
                  item.student?.full_name &&
                  item.student.full_name.trim().toLowerCase() ===
                    fullName.trim().toLowerCase();

                return (
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

                    <td className="py-3 px-6">
                      {formatDateTime(item.time_in)}
                    </td>

                    <td className="py-3 px-6">
                      {formatDateTime(item.time_out)}
                    </td>

                    <td className="py-3 px-6">
                      {canCancel ? (
                        <button
                          onClick={() => handleCancel(item.id)}
                          className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6">
                    No Schedules found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">Showing {filteredData.length} entries</div>
      </div>
    </div>
  );
}

export default Table;
