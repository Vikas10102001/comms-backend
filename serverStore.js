const { v4 } = require("uuid");
const connectedUser = new Map();
let activeRooms = [];

let io = null;
const setServerInstance = (ioInstance) => {
  io = ioInstance;
};
const getServerInstance = () => {
  return io;
};
const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUser.set(socketId, { userId });
  console.log("new connected users", connectedUser);
};
const removeDisconnectedUser = (socketId) => {
  if (connectedUser.has(socketId)) {
    connectedUser.delete(socketId);
    console.log("new connected users", connectedUser);
  }
};

const getActiveConnections = (userId) => {
  const activeConnections = [];
  connectedUser.forEach((value, key) => {
    if (value.userId === userId) activeConnections.push(key);
  });
  return activeConnections;
};
const getUserWithActiveConnection = (socket) => {
  return connectedUser.get(socket).userId;
};
const getOnlineUsers = () => {
  const onlineUsers = [];
  connectedUser.forEach((value, key) => {
    if (!onlineUsers.includes(value.userId)) onlineUsers.push(value.userId);
  });
  return onlineUsers;
};

//rooms
const addNewActiveRoom = (userId, socketId) => {
  const newActiveRoom = {
    roomCreator: {
      userId,
      socketId,
    },
    participants: [
      {
        userId,
        socketId,
      },
    ],
    roomId: v4(),
  };

  activeRooms = [...activeRooms, newActiveRoom];
  return newActiveRoom;
};

const getActiveRooms = () => {
  return activeRooms;
};

const getActiveRoom = (roomId) => {
  const activeRoom = activeRooms.find((room) => {
    return room.roomId === roomId;
  });

  return activeRoom;
};

const joinRoom = (participantDetails, roomId) => {
  activeRooms.forEach((room) => {
    if (room.roomId === roomId) {
      room.participants.push(participantDetails);
    }
  });
};

const leaveRoom = (participantSocketId, roomId) => {
  let activeRoom = getActiveRoom(roomId);

  activeRooms = activeRooms.filter((room) => {
    return room.roomId != roomId;
  });
  if (activeRoom) {
    activeRoom.participants = activeRoom.participants.filter((participant) => {
      return participant.socketId != participantSocketId;
    });
  }
  if (activeRoom.participants.length > 0)
    activeRooms = [...activeRooms, activeRoom];
};
module.exports = {
  addNewConnectedUser,
  removeDisconnectedUser,
  getActiveConnections,
  getUserWithActiveConnection,
  setServerInstance,
  getServerInstance,
  getOnlineUsers,
  addNewActiveRoom,
  getActiveRooms,
  getActiveRoom,
  joinRoom,
  leaveRoom,
};
