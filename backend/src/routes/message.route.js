import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  getGroupMessages,
  sendGroupMessage,
  toggleReaction
} from "../controllers/message.controller.js";
const router = express.Router();


router.get("/users", protectRoute, getUsersForSidebar);

router.get("/group/:groupId", protectRoute, getGroupMessages)
router.post("/group/send/:groupId", protectRoute, sendGroupMessage)
// route for getting  messages 
router.get("/:id", protectRoute, getMessages);
// send messages post method 
router.post("/send/:id", protectRoute, sendMessage)
// toggle emoji reaction on a message
router.put("/:id/react", protectRoute, toggleReaction);

export default router;
