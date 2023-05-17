const catchAsync = require("../utils/catchAsync");
const User = require("../model/User");
const FriendInvitation = require("../model/FriendInvitation");
const {
  updateFriendsPendingInvitation,
  updateFriendsList,
} = require("../socket handlers/updates/friends");

exports.invitationHandler = catchAsync(async (req, res, next) => {
  const targetUserEmail = req.body.email;
  if (targetUserEmail.toLowerCase() === req.user.email.toLowerCase()) {
    return res.status(409).json({
      status: "error",
      error: "You cannot send invitation to yourself",
    });
  }
  const targetUser = await User.findOne({ email: targetUserEmail });
  if (!targetUser) {
    return res.status(404).json({
      status: "error",
      error: "No user with that email address.Check email address",
    });
  }

  if (targetUser.friends.includes(req.user.id)) {
    return res.status(409).json({
      status: "error",
      error: "User already added.Check friendlist",
    });
  }

  const invitationAlreadySent = await FriendInvitation.findOne({
    senderId: req.user.id,
    recieverId: targetUser._id,
  });

  if (invitationAlreadySent) {
    return res.status(409).json({
      status: "error",
      error:
        "Invitation already sent wait until the user respond the invitation",
    });
  }

  await FriendInvitation.create({
    senderId: req.user.id,
    recieverId: targetUser._id,
  });
  updateFriendsPendingInvitation(targetUser._id.toString());
  res.status(201).send("Successfully sent");
});

exports.invitationAcceptHandler = catchAsync(async (req, res, next) => {
  const invitation = await FriendInvitation.findById(req.body.id);
  if (!invitation) {
    res.status(404).send("Error occured ! Please try again");
  }
  const { senderId, recieverId } = invitation;
  await User.findByIdAndUpdate(senderId, { $push: { friends: recieverId } });
  await User.findByIdAndUpdate(recieverId, { $push: { friends: senderId } });
  await FriendInvitation.findOneAndDelete({ _id: req.body.id });

  //update friends at reciever end
  updateFriendsList(recieverId.toString());
  updateFriendsList(senderId.toString())
  //update friends pending list
  updateFriendsPendingInvitation(recieverId.toString());
  res.status(201).send("Friend Added");
});

exports.invitationRejectHandler = catchAsync(async (req, res, next) => {
  const invitation = await FriendInvitation.findById(req.body.id);
  if (!invitation) {
    res.status(404).send("Error occured ! Please try again");
  }
  const { senderId, recieverId } = invitation;
  await FriendInvitation.findOneAndDelete({ _id: req.body.id });

  updateFriendsPendingInvitation(recieverId.toString());
  res.status(201).send("Invitation Rejected");
});
