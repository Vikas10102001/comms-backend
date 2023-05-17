const Conversation = require("../../model/Conversation");
const {
  getServerInstance,
  getActiveConnections,
} = require("../../serverStore");

const updateChats = async (conversationId, specificSocket) => {
  const conversation = await Conversation.findById(conversationId).populate({
    path: "messages",
    populate: {
      path: "author",
      select: " _id username",
    },
  });
  if (conversation) {
    const io = getServerInstance();
    if (specificSocket) {
      io.to(specificSocket).emit("direct-chat-history", {
        messages: conversation.messages,
        participants: conversation.participants,
        type: conversation.type,
        conversationId,
      });
    } else {
      conversation.participants.forEach((user) => {
        const activeConnections = getActiveConnections(user.toString());

        activeConnections.forEach((socketId) => {
          io.to(socketId).emit("direct-chat-history", {
            messages: conversation.messages,
            participants: conversation.participants,
            type: conversation.type,
            conversationId,
          });
        });
      });
    }
  }
};

module.exports = { updateChats };
