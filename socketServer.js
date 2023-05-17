const socketAuth = require("./controller/socketAuthController");
const { setServerInstance, getOnlineUsers } = require("./serverStore");
const {
  directChatHistoryHandler,
  groupChatHistoryHandler,
} = require("./socket handlers/directChatHistoryHandler");
const directMessageHandler = require("./socket handlers/directMessageHandler");
const { disconnectHandler } = require("./socket handlers/disconnectHandler");
const {
  newConnectionHandler,
} = require("./socket handlers/newConnectionHandler");
const roomJoinHandler = require("./socket handlers/roomJoinHandler");
const leaveRoomHandler = require("./socket handlers/roomLeaveHandler");
const roomCreateHandler = require("./socket handlers/roomCreateHandler");
const roomInitConnectionHandler = require("./socket handlers/roomInitConnectionHandler");
const roomSignalDataHandler = require("./socket handlers/roomSignalDataHandler");
const groupCreateHandler = require("./socket handlers/groupCreateHandler");
const groupMessageHandler = require("./socket handlers/groupMessageHandler");
const deleteGroupHandler = require("./socket handlers/groupDeleteHandler");
const leaveKickGroupHandler = require("./socket handlers/leaveKickGroupHandler");
const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["POST", "GET"],
    },
  });

  setServerInstance(io);
  io.use((socket, next) => {
    socketAuth(socket, next);
  });
  const emitOnlineUsers = () => {
    const onlineUsers = getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };
  io.on("connect", (socket) => {
    newConnectionHandler(socket, io);
    emitOnlineUsers();
    socket.on("direct-message", (data) => {
      directMessageHandler(socket, data);
    });
    socket.on("direct-chat-history", (data) => {
      directChatHistoryHandler(socket, data);
    });
    socket.on("group-chat-history", (data) => {
      groupChatHistoryHandler(socket, data);
    });
    socket.on("create-room", () => {
      roomCreateHandler(socket);
    });
    socket.on("join-room", (data) => {
      roomJoinHandler(socket, data);
    });
    socket.on("leave-room", (data) => {
      leaveRoomHandler(socket, data);
    });
    socket.on("con-init", (data) => {
      roomInitConnectionHandler(socket, data);
    });

    socket.on("con-signal", (data) => {
      roomSignalDataHandler(socket, data);
    });

    socket.on("create-group", (data) => {
      groupCreateHandler(socket, data);
    });
    socket.on("group-message", (data) => {
      groupMessageHandler(socket, data);
    });
    socket.on("delete-group", (data) => {
      deleteGroupHandler(socket, data);
    });
    socket.on("leave-group", (data) => {
      const { groupId, userId } = data;
      leaveKickGroupHandler(
        { groupId: groupId, userId: userId },
        "USER_LEFT"
      );
    });
    socket.on("kick-user", (data) => {
      const { memberId, groupId } = data;
      leaveKickGroupHandler(
        { groupId: groupId, userId: memberId },
        "USER_REMOVED"
      );
    });
    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 6000);
};

module.exports = registerSocketServer;
