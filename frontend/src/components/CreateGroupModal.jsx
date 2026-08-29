import React, { useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

const CreateGroupModal = ({ isOpen, onClose }) => {
    const { users, createGroup } = useChatStore()
    const [name, setName] = useState("")
    const [selectedMember, setSelectedMember] = useState([])


    if (!isOpen) return null

    const toggleMember = (userId) => {
        if (selectedMember.includes(userId)) {
            setSelectedMember(selectedMember.filter(id => id !== userId))
        } else {
            setSelectedMember([...selectedMember, userId])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return toast.error("Group name is required")

        await createGroup({ name, members: selectedMember })
        setName("")
        setSelectedMember([])
        onClose()
    }
    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
        >
            <div className="bg-base-100 rounded-lg p-6 w-full max-w-md shadow-xl border border-base-300 ">
                <div className="flex justify-between items-center mb-6">
                    <h2 className='text-xs font-semibold'>Create Group</h2>
                    <button
                        onClick={onClose}
                        className='btn btn-circular btn-sm btn-ghost'
                    >
                        <X

                            size={20}
                        />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='label text-sm font-medium'>Group Name</label>
                        <input
                            type='text'
                            className='input input-bordered w-full'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='e.g. Weekend Plans'
                        />
                    </div>
                    <div className='mb-4'>
                        <label
                            className='label text-sm font-medium'
                        >Select Members</label>
                        <div className='max-h-48 overflow-y-auto border border-base-300 rounded-lg p-2 bg-base-200/50'>
                            {users.map((user) => (
                                <label key={user._id}

                                    className='flex items-center gap-3 p-2 hover:bg-base-300 cursor-pointer rounded-md transition-colors'
                                >
                                    <input
                                        type='checkbox'
                                        className='checkbox checkbox-sm checkbox-primary'
                                        checked={selectedMember.includes(user._id)}
                                        onChange={() => toggleMember(user._id)}
                                    />
                                    <div className='flex items-center gap-2'>
                                        <img
                                            src={user.profilePic || "/avatar.png"}
                                            alt={user.fullName}
                                            className='w-8 h-8 rounded-full object-cover'
                                        />
                                        <span
                                            className='text-sm font-medium'
                                        >{user.fullName}</span>

                                    </div>

                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='flex justify-end gap-2 mt-6'>

                        <button type='button' onClick={onClose} className='btn btm-ghost'>Cancel</button>
                        <button type='submit'
                            className='btn btn-primary'
                        >Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateGroupModal