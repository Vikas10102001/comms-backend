const { getServerInstance, getActiveRooms } = require("../../serverStore");

const updateRooms = (toSpecificSocket = null) => {
  const io = getServerInstance();
  const activeRooms = getActiveRooms();

  if (toSpecificSocket) {
    io.to(toSpecificSocket).emit("active-rooms", { activeRooms });
  } else {
    io.emit("active-rooms", { activeRooms });
  }
};

module.exports = {
  updateRooms,
};
