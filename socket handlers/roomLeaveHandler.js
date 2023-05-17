const { leaveRoom, getActiveRoom } = require("../serverStore");
const { updateRooms } = require("./updates/room");

const leaveRoomHandler = (socket, data) => {
  const participantSocketId = socket.id;
  const { roomId } = data;
  const activeRoom = getActiveRoom(roomId);
  if (activeRoom) {
    leaveRoom(participantSocketId, roomId);
    const updatedActiveRoom = getActiveRoom(roomId);
    if (updatedActiveRoom) {
      updatedActiveRoom.participants.forEach((participant) => {
        socket.to(participant.socketId).emit("room-participant-left", {
          leftUserSocketId: participantSocketId,
        });
      });
    }
  }
  updateRooms();
};

module.exports = leaveRoomHandler;
