const Conversation = require("../model/Conversation");
const Group = require("../model/Group");
const { updateGroup } = require("./updates/group");

const groupCreateHandler = async (socket, data) => {
  const admin = socket.user.id;
  const { name, members } = data;
  members.push(admin);
  const newConversation = await Conversation.create({
    participants: members,
    type: "GROUP",
  });
  const newGroup = await Group.create({
    admin: admin,
    name: name,
    conversation: newConversation._id,
    date: new Date(Date.now()),
  });

  if (newGroup) {
    updateGroup(null, null, members, newGroup, null);
  }
};

module.exports = groupCreateHandler;
