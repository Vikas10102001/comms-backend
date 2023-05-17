const Conversation = require("../model/Conversation");
const Group = require("../model/Group");
const { updateChats } = require("./updates/chat");

const directChatHistoryHandler = async (socket, data) => {
  const { recieverId } = data;
  const userId = socket.user.id;

  const conversation = await Conversation.findOne({
    participants: { $all: [userId, recieverId] },
  });

  if (conversation) {
    updateChats(conversation._id, socket.id);
  }
};

const groupChatHistoryHandler = async (socket, data) => {
  const { groupId } = data;

  const group = await Group.findById(groupId);
  if (group) {
    updateChats(group.conversation, socket.id);
  }
};

module.exports = { directChatHistoryHandler, groupChatHistoryHandler };
