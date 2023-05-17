const FriendInvitation = require("../../model/FriendInvitation");
const User = require("../../model/User");
const {
  getActiveConnections,
  getServerInstance,
} = require("../../serverStore");
const updateFriendsPendingInvitation = async (userId) => {
  try {
    const pendingInvitations = await FriendInvitation.find({
      recieverId: userId,
    }).populate({ path: "senderId", select: "_id username email" });
    const recieverList = getActiveConnections(userId);
    const io = getServerInstance();

    recieverList.forEach((recieverId) => {
      io.to(recieverId).emit("friends-invitations", {
        pendingFriendsInvitations: pendingInvitations ? pendingInvitations : [],
      });
    });
  } catch (er) {
    console.log(er);
  }
};

const updateFriendsList = async (userId) => {
  try {
    const user = await User.findById(userId).populate({
      path: "friends",
      select: "_id username email",
    });
    const recieverList = getActiveConnections(userId);
    const friends = user.friends;
    const io = getServerInstance();
    recieverList.forEach((recieverId) => {
      io.to(recieverId).emit("friends", {
        friends: friends ? friends : [],
      });
    });
  } catch (er) {
    console.log(er);
  }
};

module.exports = {
  updateFriendsPendingInvitation,
  updateFriendsList
};
