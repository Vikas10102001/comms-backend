const Message = require("../model/Message");
const Conversation = require("../model/Conversation");
const { updateChats } = require("./updates/chat");
const directMessageHandler = async (socket, data) => {
  const userId = socket.user.id;
  const { recieverId, content } = data;
 
  const message = await Message.create({
    author: userId,
    date: new Date(Date.now()),
    content: content,
  });

  //check if conversation with userId recieverId exists
  const conversation = await Conversation.findOne({
    participants: { $all: [recieverId, userId] },
  });

  if (!conversation) {
    const newConversation = await Conversation.create({
      participants: [recieverId, userId],
      messages: [message._id],
      type: "DIRECT",
    });
    updateChats(newConversation._id);
  } else {
    conversation.messages.push(message._id);
    await conversation.save();
    updateChats(conversation._id);
  }
};

module.exports = directMessageHandler;
