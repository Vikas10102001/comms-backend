const Conversation = require("../model/Conversation");
const Group = require("../model/Group");
const Message = require("../model/Message");
const { updateChats } = require("./updates/chat");

const groupMessageHandler= async (socket, data) => {
    const userId = socket.user.id;
    const { groupId , content } = data; //reciever id is an array of members
  
    const message = await Message.create({
      author: userId,
      date: new Date(Date.now()),
      content: content,
    });
  
    const group = await Group.findById(groupId)

    if(group)
    {
      const conversation=await Conversation.findById(group.conversation)
      conversation.messages.push(message._id)
      await conversation.save();
      updateChats(conversation._id);
    }
}

module.exports=groupMessageHandler