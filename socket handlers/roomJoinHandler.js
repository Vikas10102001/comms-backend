const { getActiveRoom, joinRoom } = require("../serverStore");
const { updateRooms } = require("./updates/room");

const roomJoinHandler = (socket, data) => {
  const { roomId } = data;
  const participantDetails = {
    userId: socket.user.id,
    socketId: socket.id,
  };

  const roomDetails = getActiveRoom(roomId);

  if (roomDetails) {
    joinRoom(participantDetails, roomId);
  }

  //send info to users in room for preparing for connection
  roomDetails.participants.forEach((participant) => {
    if (participant.socketId != participantDetails.socketId) {
      socket.to(participant.socketId).emit("con-prepare", {
        conUserSocketId: participantDetails.socketId,
      });
    }
  });
  updateRooms();
};

module.exports = roomJoinHandler;
