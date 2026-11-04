import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    linkPreview: {
      url: String,
      title: String,
      description: String,
      image: String

    },
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        emoji: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);

export default Message;
