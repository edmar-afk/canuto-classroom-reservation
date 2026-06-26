import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import api from "../../assets/api";
import RoomLists from "./RoomLists";

function BookRoomForm({ onClose }) {
  const [data, setData] = useState(null);

  const [date, setDate] = useState(dayjs());
  const [timeIn, setTimeIn] = useState(dayjs());
  const [timeOut, setTimeOut] = useState(dayjs());
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [course, setCourse] = useState("");
  const [yearLvl, setYearLvl] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);

  const isPastDate = date.startOf("day").isBefore(dayjs().startOf("day"));

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
        console.error(error);
      }
    };

    fetchProfile();
    fetchRooms();
    fetchReservations();
  }, []);

  const userId = data?.user?.id;
  const fullName = data?.student?.full_name;

  const hasTimeConflict = reservations.some((item) => {
    const sameRoom = item.room.id === Number(selectedRoom);

    const sameDate = item.reserve_date === date.format("YYYY-MM-DD");

    if (!sameRoom || !sameDate) return false;

    const existingStart = dayjs(item.time_in);
    const existingEnd = dayjs(item.time_out);

    const userStart = dayjs(
      `${date.format("YYYY-MM-DD")} ${timeIn.format("HH:mm:ss")}`,
    );

    const userEnd = dayjs(
      `${date.format("YYYY-MM-DD")} ${timeOut.format("HH:mm:ss")}`,
    );

    const overlaps =
      userStart.isBefore(existingEnd) && userEnd.isAfter(existingStart);

    return overlaps;
  });

  const fetchReservations = async () => {
    try {
      const res = await api.get("/api/all-reservations/");
      setReservations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await api.get("/api/rooms/");
      setRooms(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const isFormInvalid =
    !selectedRoom ||
    !course ||
    !yearLvl ||
    !subject.trim() ||
    !section.trim() ||
    !date ||
    isPastDate ||
    hasTimeConflict;

  const handleSubmit = async () => {
    if (isFormInvalid) return;

    if (!userId) {
      Swal.fire("Error", "User not found", "error");
      return;
    }

    setLoading(true);

    try {
      const timeInFinal = date
        .hour(timeIn.hour())
        .minute(timeIn.minute())
        .second(0);

      const timeOutFinal = date
        .hour(timeOut.hour())
        .minute(timeOut.minute())
        .second(0);

      await api.post(`/api/student-reserve/${userId}/${selectedRoom}/`, {
        course,
        year_lvl: yearLvl,
        subject,
        section,
        reserve_date: date.format("YYYY-MM-DD"),
        time_in: timeInFinal.format("YYYY-MM-DD HH:mm:ss"),
        time_out: timeOutFinal.format("YYYY-MM-DD HH:mm:ss"),
      });

      onClose();

      setSelectedRoom("");
      setCourse("");
      setYearLvl("");
      setSubject("");
      setSection("");
      setDate(dayjs());
      setTimeIn(dayjs());
      setTimeOut(dayjs());

      Swal.fire("Success", "Schedule has been set successfully", "success");
    } catch (error) {
      console.error(error);
      onClose();
      Swal.fire("Error", "Failed to set schedule", "error");
    } finally {
      setLoading(false);
    }
  };

  console.log("Full Name in BookRoomForm:", fullName);
  console.log("User ID in BookRoomForm:", userId);

  return (
    <div>
      <div className="grid lg:grid-cols-2 items-start gap-16 p-6 mx-auto max-w-5xl max-lg:max-w-2xl bg-white">
        <div>
          <h2 className="text-gray-900 text-3xl font-bold">
            Set Classroom Schedule to your Students
          </h2>

          <p className="text-[15px] text-gray-600 mt-4 leading-relaxed">
            Browse or select a date and time in/out for your schedule.
          </p>

          <RoomLists selectedRoom={selectedRoom} />
        </div>

        <form
          className="lg:ml-auto space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-row gap-2">
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full rounded-md py-3 px-4 bg-blue-100 text-blue-900 text-sm border border-gray-200"
            >
              <option value="">Select Room</option>

              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>

            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full rounded-md py-3 px-4 bg-blue-100 text-blue-900 text-sm border border-gray-200"
            >
              <option value="">Select Course</option>
              <option value="BTVTED">BTVTED</option>
              <option value="BSIS">BSIS</option>
              <option value="ACT">ACT</option>
            </select>

            <select
              value={yearLvl}
              onChange={(e) => setYearLvl(e.target.value)}
              className="w-full rounded-md py-3 px-4 bg-blue-100 text-blue-900 text-sm border border-gray-200"
            >
              <option value="">Year Level</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div className="flex flex-row gap-2">
            <input
              type="text"
              placeholder="Subject Name"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-md py-3 px-4 bg-blue-100 text-blue-900 text-sm border border-gray-200"
            />
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full rounded-md py-3 px-4 bg-blue-100 text-blue-900 text-sm border border-gray-200"
            >
              <option value="">Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          {isPastDate && (
            <p className="text-sm text-red-500 mt-2 mb-4 font-bold">
              Please select a valid upcoming date. Past dates are not allowed.
            </p>
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {" "}
            <DateCalendar
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{
                width: "100%",
                maxWidth: "100%",
                "& .MuiDayCalendar-monthContainer": { width: "100%" },
                "& .MuiDayCalendar-header": {
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  width: "100%",
                  px: 0,
                },
                "& .MuiDayCalendar-weekDayLabel": {
                  width: "100%",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
                "& .MuiDayCalendar-weekContainer": {
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  width: "100%",
                  margin: 0,
                },
                "& .MuiPickersDay-root": {
                  width: "100%",
                  margin: 0,
                  borderRadius: 0,
                  aspectRatio: "1 / 1",
                  height: "auto",
                },
              }}
            />{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <TimePicker
                label="Time In"
                value={timeIn}
                onChange={(newValue) => setTimeIn(newValue)}
              />{" "}
              <TimePicker
                label="Time Out"
                value={timeOut}
                onChange={(newValue) => setTimeOut(newValue)}
              />{" "}
            </div>{" "}
          </LocalizationProvider>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || isFormInvalid}
            className={`text-white rounded-md text-sm font-medium px-4 py-3 w-full transition ${
              loading || isFormInvalid
                ? "bg-red-500 cursor-not-allowed"
                : "bg-blue-900 hover:bg-blue-800"
            }`}
          >
            {loading
              ? "Saving..."
              : hasTimeConflict
                ? "Schedule time conflicts with an existing Schedule"
                : "Set Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookRoomForm;
