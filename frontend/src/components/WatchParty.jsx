import React, { useRef, useState, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { X } from "lucide-react";
import ReactPlayer from "react-player";

const WatchParty = () => {
    const { selectedUser, activeVideoUrl, videoAction, videoTime, syncVideo, endWatchParty } = useChatStore();
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(true);
    const [localTime, setLocalTime] = useState(0); // Safely track time here!

    // Sync incoming socket events with our local player
    useEffect(() => {
        if (videoAction === "pause") setPlaying(false);
        if (videoAction === "play") setPlaying(true);
        if (videoAction === "seek" && playerRef.current) {
            // Safely check if seekTo is available before calling it to prevent crashes
            if (typeof playerRef.current.seekTo === 'function') {
                playerRef.current.seekTo(videoTime);
            }
        }
    }, [videoAction, videoTime]);

    if (!activeVideoUrl || !selectedUser) return null;

    return (
        <div className='w-full bg-base-300 p-3 flex flex-col gap-2 shadow-xl z-20 border-b border-base-100'>
            <div className="flex justify-between items-center px-1">
                <span className="font-bold text-sm text-primary flex items-center gap-2">
                    <span className="animate-pulse">🔴</span> Live Watch Party
                </span>
                <button
                    onClick={() => endWatchParty(selectedUser._id)}
                    className='btn btn-xs btn-circle btn-ghost text-error hover:bg-error/20'
                >
                    <X size={16} />
                </button>
            </div>

            {/* The Video Player */}
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-inner">
                <ReactPlayer
                    ref={playerRef}
                    url={activeVideoUrl}
                    width="100%"
                    height="100%"
                    playing={playing}
                    controls={true}
                    // Safely track the time every second without using refs
                    onProgress={(progress) => setLocalTime(progress.playedSeconds)}
                    onPlay={() => {
                        setPlaying(true);
                        syncVideo(selectedUser._id, 'play', localTime);
                    }}
                    onPause={() => {
                        setPlaying(false);
                        syncVideo(selectedUser._id, "pause", localTime);
                    }}
                    onSeeked={(time) => syncVideo(selectedUser._id, 'seek', time)}
                />
            </div>
        </div>
    );
};

export default WatchParty;