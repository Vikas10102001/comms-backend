const roomSignalDataHandler = (socket, data) => {
  const { conUserSocketId, signal } = data;
  const signalingData = { signal: signal, conUserSocketId: socket.id };
  socket.to(conUserSocketId).emit("con-signal", signalingData);
};

module.exports = roomSignalDataHandler;
