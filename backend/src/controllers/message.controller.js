import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Group from "../models/group.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      return res.status(400).json({ error: "Invalid user authentication" });
    }

    const filteredUsers = await User.find({
      // fetch all users except the current one
      _id: { $ne: loggedInUserId },
    }).select("-password -__v"); // Exclude sensitive fields

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user?._id;

    if (!myId || !userToChatId) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    // Cursor-based pagination: `limit` controls batch size, `before` is the
    // oldest message _id from the previous fetch used as a cursor.
    const limit = parseInt(req.query.limit) || 20;
    const before = req.query.before; // message _id cursor

    const baseQuery = {
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    };

    // When a cursor is provided, only fetch messages older than it
    if (before) {
      baseQuery._id = { $lt: before };
    }

    // Fetch one extra message to determine if there are more pages
    const messages = await Message.find(baseQuery)
      .sort({ _id: -1 }) // newest first so we can limit efficiently
      .limit(limit + 1)
      .lean();

    const hasMore = messages.length > limit;

    // Remove the extra lookahead message and reverse to chronological order
    const payload = messages.slice(0, limit).reverse();

    res.status(200).json({ messages: payload, hasMore });
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Allows a user to send a message(text or image).if the receiver is online,it sends the
// message in real-time using Socket.io
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    // Must have either text or image
    if (!text?.trim() && !image) {
      return res
        .status(400)
        .json({ error: "Message text or image is required" });
    }

    let imageUrl = null;

    if (image) {
      // cloudinary is used to store the image in base64 format
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "messages",
        });

        imageUrl = uploadResponse.secure_url;
      } catch (cloudError) {
        console.error("Cloudinary upload failed:", cloudError.message);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text?.trim(),
      image: imageUrl,
    });

    await newMessage.save();

    // Placeholder for real-time functionality
    // socket.emit("newMessage", newMessage);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params
    const limit = parseInt(req.query.limit) || 20
    const before = req.query.before


    const baseQuery = { groupId }
    if (before) {
      baseQuery._id = { $lt: before }
    }

    const messages = await Message.find(baseQuery)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()

    const hasMore = messages.length > limit
    const payload = messages.slice(0, limit).reverse()


    res.status(200).json({ messages: payload, hasMore })


  } catch (error) {
    console.error("Error in getGroupMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}


export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image } = req.body
    const { groupId } = req.params
    const senderId = req.user._id


    if (!text?.trim() && !image) {
      return res.status(400).json({ error: "Message text or image is required" })
    }

    let imageUrl = null

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, { folder: "messages" })
      imageUrl = uploadResponse.secure_url
    }
    const newMessage = new Message({
      senderId,
      groupId,
      text: text?.trim(),
      image: imageUrl
    })

    await newMessage.save()

    // Emit to the group's socket room (instead of an individual user)

    io.to(groupId).emit("newMessage", newMessage)

    res.status(201).json(newMessage)
  } catch (error) {
    console.error("Error in sendGroupMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}