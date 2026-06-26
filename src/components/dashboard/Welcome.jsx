import React from "react";
import classRoomImg from "../../assets/images/class.gif";

function Welcome() {
  return (
    <div className="gap-4 sm:gap-12 flex flex-row flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between p-4 border-1 rounded-lg border-gray-200 bg-white px-4 sm:px-12">
      <div>
        <p className="font-bold text-xl sm:text-4xl mb-8">
          Welcome to the Classroom Scheduling Dashboard
        </p>
        <p className="text-gray-700">
          This system allows you to browse available classrooms, check which
          rooms are currently occupied in real time, and quickly identify empty
          rooms for schedules. It helps streamline room management and makes
          scheduling more efficient for everyone.
        </p>
      </div>
      <img src={classRoomImg} className="w-72" alt="Classroom illustration" />
    </div>
  );
}

export default Welcome;