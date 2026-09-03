import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { addMembersToGroup, createGroup, getGroups, removeMemberFromGroup } from "../controllers/group.controller.js"

const router = express.Router()


router.post("/", protectRoute, createGroup)
router.get("/", protectRoute, getGroups)
router.post("/:groupId/members", protectRoute, addMembersToGroup)
router.delete("/:groupId/members/:memberId", protectRoute, removeMemberFromGroup)

export default router