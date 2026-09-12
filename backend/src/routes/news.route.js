import express from "express";
import { getNews } from "../controllers/news.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only logged in users can fetch the news
router.get("/", protectRoute, getNews);

export default router;
