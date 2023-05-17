const { addNewActiveRoom } = require("../serverStore");
const { updateRooms } = require("./updates/room");
const roomCreateHandler = (socket) => {
  const userId = socket.user.id;
  const socketId = socket.id;

  const roomDetails = addNewActiveRoom(userId, socketId);

  socket.emit("room-create", {
    roomDetails,
  });

  updateRooms();
};

module.exports = roomCreateHandler;
