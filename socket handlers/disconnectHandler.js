const { removeDisconnectedUser, getActiveRooms } = require("../serverStore");
const leaveRoomHandler = require("./roomLeaveHandler");

const disconnectHandler = (socket) => {
  const activeRooms = getActiveRooms();

  activeRooms.forEach((room) => {
    userInroom = room.participants.some((participant) => {
      participant.socketId === socket.id;
    });

    if(userInroom);
    {
      leaveRoomHandler(socket, { roomId: room.roomId });
    }
  });
  removeDisconnectedUser(socket.id);
};

module.exports = {
  disconnectHandler,
};
