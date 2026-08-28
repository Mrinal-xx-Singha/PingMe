import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { addMembersToGroup, createGroup, getGroups } from "../controllers/group.controller.js"

const router = express.Router()


router.post("/", protectRoute, createGroup)
router.get("/", protectRoute, getGroups)
router.post("/:groupId/members", protectRoute, addMembersToGroup)


export default router