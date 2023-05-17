const Mongoose = require("mongoose");

const groupSchema = Mongoose.Schema({
  conversation: {
    type: Mongoose.Schema.ObjectId,
    ref: "Conversation",
  },
  name: {
    type: String,
    required: [true, "Group must have a name"],
    minLength: [3, "Group name must have 3 letters"],
  },
  admin: {
    type: Mongoose.Schema.ObjectId,
    ref: "User",
  },
  date: Date,
});

const Group = Mongoose.model("Group", groupSchema);

module.exports = Group;
