import React, { useState } from "react";
import { Users, X, ArrowLeft, Volume2, VolumeX, Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import AddMemberModal from "./AddMemberModal";
import ManageGroupModal from "./ManageGroupModal";
import StartWatchPartyModal from "./StartWatchPartyModal";

const ChatHeader = () => {
  const { selectedUser, setSelected, typingUsers, viewingUsers, users, isSoundEnabled, toggleSound, searchQuery, setSearchQuery, messages } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [isWatchPartyOpen, setIsWatchPartyOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const matchCount = searchQuery.trim() ? messages.filter((m) => m.text?.toLowerCase().includes(searchQuery.toLowerCase())).length : 0


  const isTyping = typingUsers.includes(selectedUser._id)
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelected(null)}
              className="btn btn-ghost btn-sm btn-circle lg:hidden"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || (selectedUser.isGroup ? "/group-image.jpeg" : "/avatar.png")}
                alt={selectedUser.fullName}
                className="size-full object-cover rounded-full"
              />
            </div>
          </div>
          {/* User Info */}
          <div>
            <h3 className="font-medium text-sm lg:text-md">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {selectedUser.isGroup ? `${selectedUser.members?.length || 0} members` : (onlineUsers.includes(selectedUser._id) ? "Online" : "Offline")}
            </p>
          </div>
        </div>
        {/* Close btn */}
        <div className="flex items-center gap-1 lg:gap-2 shrink-0">
          {/* Admin buttons -hidden on mobile, show on desktop */}
          {selectedUser.isGroup && selectedUser.adminId === authUser._id && (
            <div className="hidden sm:flex gap-2 mr-2">

              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="btn btn-xs btn-primary"
              >Add Member</button>
              <button
                onClick={() => setIsManageOpen(true)}
                className="btn btn-xs btn-secondary"
              >
                Manage
              </button>
            </div>
          )}
          {selectedUser.isGroup && selectedUser.adminId !== authUser._id && (
            <button
              onClick={async () => {
                if (window.confirm("Are you sure you want to leave this group ? ")) {
                  await useChatStore.getState().removeMember(selectedUser._id, authUser._id)
                  setSelected(null)
                }
              }}
              className="btn btn-xs btn-error btn-outline mr-2"
            >
              Leave
            </button>
          )}
          {selectedUser.isGroup && (
            <button
              onClick={() => setIsWatchPartyOpen(true)}
              className="btn btn-xs btn-accent mr-2"
              title="Start Watch Party"
            >🍿 <span className="hidden sm:inline">Watch</span></button>
          )}
          {/* Search Togle Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
           className={`btn btn-ghost btn-sm btn-circle ${isSearchOpen ? "text-primary" : ""}`}
            title="Search in conversation"
          >
            <Search size={18} />
          </button>
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className="btn btn-ghost btn-sm btn-circle"
            title={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}
          >
            {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-base-content/40" />}
          </button>
          {/* Close Chat Button */}
          <button onClick={() => setSelected(null)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X />
          </button>
        </div>
      </div>
      {isSearchOpen && (
        <div
          className="mt-2 pt-2 border-t border-base-300 flex items-center gap-2 animate-fade-in"
        >
          <div className="relative flex-1">
            <Search size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
            />
            <input
              value={searchQuery}
              type="text"
              placeholder="search in conversation...."
              autoFocus
              className="input input-sm w-full pl-9 pr-8 bg-base-200 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                onClick={() => setSearchQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </div>
          {searchQuery.trim() && (
            <span
              className="text-xs text-base-content/60 shrink-0"
            >
              {matchCount} {matchCount === 1 ? "match" : "matches"}
            </span>
          )}

        </div>
      )}
      {
        isTyping && !selectedUser.isGroup && (
          <span className="text-sm text-green-500 italic">
            Typing...
          </span>
        )}
      {/* Presence Indicator */}
      {viewingUsers.length > 0 && (
        <span className="text-xs text-blue-400 flex items-center gap-1 mt-0.5">
          👀 {viewingUsers.map(id => {
            const user = users.find(u => u._id === id)
            return user?.fullName?.split(' ')[0] || "Someone"
          }).join(", ")} {viewingUsers.length === 1 ? "is" : "are"} viewing this chat
        </span>
      )}

      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
      <ManageGroupModal isOpen={isManageOpen} onClose={() => setIsManageOpen(false)} />
      <StartWatchPartyModal isOpen={isWatchPartyOpen} onClose={() => setIsWatchPartyOpen(false)} />
    </div>
  );
};

export default ChatHeader;
