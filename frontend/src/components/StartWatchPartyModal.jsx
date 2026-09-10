import React, { useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { X, Play } from "lucide-react"

const StartWatchPartyModal = ({ isOpen, onClose }) => {
    const { selectedUser, startWatchParty } = useChatStore()
    const [videoUrl, setVideoUrl] = useState("")

    if (!isOpen) return null
    
    const handleStart = () => {
        if (!videoUrl.trim()) return
        startWatchParty(selectedUser._id, videoUrl.trim())
        setVideoUrl('')
        onClose()
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-sm shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold flex items-center gap-2">
                        <Play  className='text-red-500' size={30}/>
                        Start Watch Party
                    </h2>
                    <button
                        onClick={onClose}
                        className='btn btn-sm btn-ghost btn-circle'
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="text-sm text-base-content/70 mb-4">
                    Paste a youtube link below to start watching instantly with the group!</p>
                <input type="text"
                    placeholder='https://www.youtube.com/watch?v=....'
                    className='input input-bordered w-full mb-4 focus:border-red-500'
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStart()}
                    autoFocus
                />
                <button
                    onClick={handleStart}
                    disabled={!videoUrl.trim()}
                    className="btn btn-primary w-full">
                    Launch Player🚀
                </button>
            </div>
        </div>
    )
}

export default StartWatchPartyModal