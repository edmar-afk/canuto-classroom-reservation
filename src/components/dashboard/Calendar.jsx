import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import morningImg from "../../assets/images/calendar/morning.jpg";
import afternoonImg from "../../assets/images/calendar/afternoon.png";
import nightImg from "../../assets/images/calendar/night.png";

function Calendar({
  course,
  year_lvl,
  section,
  selectedDate,
  setSelectedDate,
}) {
  const [value, setValue] = useState(dayjs());

  useEffect(() => {
    if (setSelectedDate) {
      setSelectedDate(value.toDate());
    }
  }, [value, setSelectedDate]);

  const getImageByTime = () => {
    const hour = value.hour();
    const minute = value.minute();
    const totalMinutes = hour * 60 + minute;

    if (totalMinutes >= 300 && totalMinutes <= 720) {
      return morningImg;
    }

    if (totalMinutes >= 721 && totalMinutes <= 1020) {
      return afternoonImg;
    }

    return nightImg;
  };

  return (
    <>
      <div className="-p-4 bg-white rounded-2xl shadow-md w-full sm:w-fit">
        <div className="relative p-4 text-white rounded-t-xl overflow-hidden">
          <img
            src={getImageByTime()}
            className="absolute inset-0 w-full h-full object-cover z-0"
            alt="Background"
          />

          <div className="absolute inset-0 bg-black/40 z-10" />

          <div className="relative z-20 py-4">
            <p className="mt-3 text-lg font-bold">
              <span className="opacity-0">{value.format("hh:mm A")}</span>
            </p>
          </div>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={value}
            onChange={(newValue) => {
              if (newValue) {
                setValue((prev) =>
                  newValue.hour(prev.hour()).minute(prev.minute()),
                );
              }
            }}
            className="bg-white rounded-xl w-full"
            sx={{
              "& .MuiPickersDay-root": {
                borderRadius: "8px",
              },
              "& .Mui-selected": {
                backgroundColor: "#3b82f6 !important",
              },
            }}
          />
        </LocalizationProvider>
      </div>

      <p className="mt-8 w-72 text-lg font-semibold text-gray-400">
        We are showing only schedules for {course} - {year_lvl} - {section}{" "}
        based on your profile.
      </p>
    </>
  );
}

export default Calendar;
