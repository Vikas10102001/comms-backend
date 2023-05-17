const Conversation = require("../model/Conversation");
const Group = require("../model/Group");
const Message = require("../model/Message");
const User = require("../model/User");
const { getServerInstance } = require("../serverStore");
const { getActiveConnections } = require("../serverStore");
const { updateChats } = require("./updates/chat");
const { updateGroup } = require("./updates/group");

const leaveKickGroupHandler = async ({ groupId, userId }, messageVariant) => {
  const group = await Group.findById(groupId);
  const conversation = await Conversation.findById(group.conversation);
  const newParticipants = conversation.participants.filter((participant) => {
    return participant.toString() !== userId;
  });

  conversation.participants = newParticipants;

  await conversation.save();
  const user = await User.findById(userId);
  const activeConnection = getActiveConnections(user._id.toString());
  const io = getServerInstance();
  let content;
  if (messageVariant === "USER_LEFT") {
    content = `${user.username} left the group`;
  } else if (messageVariant === "USER_REMOVED") {
    content = `${user.username} was removed`;
    activeConnection.forEach((socket) => {
      io.to(socket).emit("user-removed", { group });
    });
  }
  const newMessage = await Message.create({
    author: userId,
    date: new Date(Date.now()),
    content: content,
    variant: messageVariant,
  });
  conversation.messages.push(newMessage._id);
  await conversation.save();
  let members = [];
  conversation.participants.forEach((participant) => {
    members.push(participant.toString());
  });
  members.push(userId);
  updateGroup(null, null, members, null, null);
  updateChats(conversation._id);
};

module.exports = leaveKickGroupHandler;
