import Group from "../models/group.model.js";


export const createGroup = async (req, res) => {
    try {
        const { name, members } = req.body
        const adminId = req.user._id

        //    Ensure the admin is always part of the members array, and no duplicates 
        const allMembers = [...new Set([...members, adminId.toString()])]

        const group = new Group({
            name,
            adminId,
            members: allMembers
        })

        await group.save()
        res.status(201).json(group)
    } catch (error) {
        console.error("Error creating group:", error.message)
        res.status(500).json({ error: "Internal server error" })

    }
}

export const getGroups = async (req, res) => {
    try {
        const userId = req.user._id
        // Find groups where the current user is inside the members array
        const groups = await Group.find({ members: userId }).populate("members", "-password")

        res.status(200).json(groups)


    } catch (error) {
        console.error("Error fetching groups: ", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}




export const addMembersToGroup = async (req, res) => {
    try {
        const { groupId } = req.params
        const { newMemberId } = req.body
        const adminId = req.user._id

        const group = await Group.findById(groupId)
        if (!group) return res.status(404).json({ error: 'Group not found' })

        // Ensure only the admin can add members 
        if (group.adminId.toString() !== adminId.toString()) {
            return res.status(403).json({ error: "Only the group admin can add members" })
        }
        // Check if the user is already in the group 
        if (group.members.includes(newMemberId)) {
            return res.status(400).json({ error: "User is already in the group" })
        }

        group.members.push(newMemberId)
        await group.save()

        res.status(200).json(group)

    } catch (error) {
        console.error("Error adding member:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const removeMemberFromGroup = async (req, res) => {
    try {
        const { groupId, memberId } = req.params
        const currentUserId = req.user._id

        const group = await Group.findById(groupId)
        if (!group) return res.status(404).json({ error: "Group not found" })

        // Two types of people can remove a member 
        // The admin 
        // The member themselves 

        const isAdmin = group.adminId.toString() === currentUserId.toString()
        const isSelf = currentUserId.toString() === memberId

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ error: "You dont have permission to remove this member" })
        }

        // Prevent the admin from removing themselves (to avoid leaderless group )
        if (memberId === group.adminId.toString()) {
            return res.status(400).json({ error: "The admin cannot leave the group. You must delete the group instead" })

        }
        // Filter out the member we want to remove 

        group.members = group.members.filter(id => id.toString() !== memberId)
        await group.save()

        res.status(200).json(group)
    } catch (error) {
        console.error("Error removing member:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}