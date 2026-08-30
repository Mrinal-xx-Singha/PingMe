import React, { useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Users, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

const AddMemberModal = ({isOpen,onClose}) => {
 const {users,selectedUser} = useChatStore()
const [selectedUserId,setSelectedUserId] = useState("")

if(!isOpen)return null 

const handleAdd = async() =>{
    if(!selectedUserId)return toast.error("Select a user first")
        try {
    await axiosInstance.post(`/groups/${selectedUser._id}/members`,{
            newMemberId:selectedUserId
        })
        toast.success("Member added!")
        onClose()
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to add member")
    }
}

// Only show users who arent aleady in the group 
const availableUsers = users.filter((u)=>!selectedUser.members?.includes(u._id))

 
    return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backgrop-blur-sm'>
        <div className="bg-base-100 p-6 rounded-lg w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Add Member</h2>
                <button 
                onClick={onClose}
                className="btn btn-sm btn-ghost btn-circle">
                    <X size={20}/>
                </button>
            </div>
            <select onChange={(e)=>setSelectedUserId(e.target.value)}
                className='select select-border w-full mb-4'
                >
                <option value="" disabled>Select a user</option>
                {availableUsers.map((u)=>(
                    <option key={u._id}
                    
                    value={u._id}>{u.fullName}</option>
                ))}
            </select>
            <button
            onClick={handleAdd}
            className='btn btn-primary w-full'
            >Add to Group</button>
        </div>
    </div>
  )
}

export default AddMemberModal