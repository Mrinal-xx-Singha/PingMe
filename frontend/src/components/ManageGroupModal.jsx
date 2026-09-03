import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { UserMinus, X } from "lucide-react"
const ManageGroupModal = ({ isOpen, onClose }) => {
    const { selectedUser, removeMember } = useChatStore()
    const { authUser } = useAuthStore()

    if (!isOpen || !selectedUser) return null
    const handleRemove = async (memberId) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            await removeMember(selectedUser._id, memberId)
        }

    }
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-sm shadow-xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className='font-bold text-lg'>Manage Member</h2>
                    <button onClick={onClose} className='btn btn-sm btn-ghost btn-circle'>
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 space-y-3 pr-2">
                    {selectedUser.members?.map((member) => (
                        <div
                            key={member._id}
                            className="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <img src={member.profilePic || "/avatar.png"} alt={member.fullName}
                                    className='w-10 h-10 rounded-full object-cover'
                                />
                                <span className='font-medium text-sm'>{member.fullName}

                                    {member._id === selectedUser.adminId && <span
                                        className='text-xs text-primary ml-1'
                                    >(Admin)</span>}
                                </span>
                            </div>
                            {/* Only show remove button if current user is admin, AND the target member is not the admin */}
                            {authUser._id === selectedUser.adminId && member._id !== selectedUser.adminId && (
                                <button

                                    className='btn btn-xs btn-error btn-square hover:scale-110 transition-transform '
                                    title='Remove Member'
                                    onClick={() => handleRemove(member._id)}
                                >
                                    <UserMinus size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ManageGroupModal