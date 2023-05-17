const roomInitConnectionHandler = (socket, data) => {
  const { conUserSocketId } = data;
  const initData = { conUserSocketId: socket.id };

  socket.to(conUserSocketId).emit("con-init", initData);
};

module.exports = roomInitConnectionHandler;
