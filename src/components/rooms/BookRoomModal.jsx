import React, { useState } from "react";
import { Modal, Box, Typography } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import BookRoomForm from "./BookRoomForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: 24,
  padding: "5px",
};

function BookRoomModal({ fullName, userId }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* HTML button to open */}

      <button
        onClick={() => setOpen(true)}
        class="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex flex-row items-center gap-1"
      >
        <EditNoteIcon /> Set Classroom Schedule
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <button
            onClick={() => setOpen(false)}
            className="cursor-pointer hover:scale-110 duration-300 absolute bottom-3 left-3 bg-red-500 rounded-lg p-2.5 py-1 text-white font-bold"
          >
            Close
          </button>
          <BookRoomForm
            fullName={fullName}
            userId={userId}
            onClose={() => setOpen(false)}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default BookRoomModal;
