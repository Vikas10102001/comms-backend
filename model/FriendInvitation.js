const Mongoose = require("mongoose");

const friendInvitationSchema = Mongoose.Schema({
  senderId: {
    type: Mongoose.Schema.ObjectId,
    ref: "User",
  },
  recieverId: {
    type: Mongoose.Schema.ObjectId,
    ref: "User",
  },
});


const FriendInvitation=Mongoose.model('FriendInvitation',friendInvitationSchema);

module.exports=FriendInvitation