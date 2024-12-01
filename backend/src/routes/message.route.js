import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
// route for getting  messages 
router.get("/:id", protectRoute, getMessages);
// send messages post method 
router.post("/send/:id",protectRoute, sendMessage)
export default router;
