const Group = require("../../model/Group");
const { getServerInstance } = require("../../serverStore");
const { getActiveConnections } = require("../../serverStore");

const updateGroup = async (
  userId,
  toSpecificSocket,
  toGroupMembers,
  newGroup,
  deletedGroup
) => {
  const io = getServerInstance();
  const groups = await Group.find()
    .populate({ path: "admin", select: "username email" })
    .populate({
      path: "conversation",
      populate: {
        path: "participants",
        select: "username email",
      },
    });

  if (toSpecificSocket) {
    let groupUpdate = [];
    groups.forEach((group) => {
      group.conversation.participants.forEach((participant) => {
        if (participant._id.toString() === userId) groupUpdate.push(group);
      });
    });

    io.to(toSpecificSocket).emit("group-update", {
      groupUpdate,
      newGroup,
      deletedGroup,
    });
  }

  if (toGroupMembers) {
    toGroupMembers.forEach((member) => {
      let groupUpdate = [];
      groups.forEach((group) => {
        group.conversation.participants.forEach((participant) => {
          if (participant._id.toString() === member) groupUpdate.push(group);
        });
      });

      const activeConnections = getActiveConnections(member.toString());
      activeConnections.forEach((socketId) => {
        io.to(socketId).emit("group-update", {
          groupUpdate,
          newGroup,
          deletedGroup,
        });
      });
    });
  }
};

module.exports = {
  updateGroup,
};
