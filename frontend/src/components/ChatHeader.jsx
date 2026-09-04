import React, { useState } from "react";
import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import AddMemberModal from "./AddMemberModal";
import ManageGroupModal from "./ManageGroupModal";

const ChatHeader = () => {
  const { selectedUser, setSelected, typingUsers } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isManageOpen,setIsManageOpen]= useState(false)


  const isTyping = typingUsers.includes(selectedUser._id)
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatr">
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
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {selectedUser.isGroup ? `${selectedUser.members?.length || 0} members` : (onlineUsers.includes(selectedUser._id) ? "Online" : "Offline")}
            </p>
          </div>
        </div>
        {/* Close btn */}
        <div className="flex items-center gap-2 ">
          {selectedUser.isGroup && selectedUser.adminId === authUser._id && (
          <div className="flex gap-2 mr-2">

          <button
              onClick={() => setIsAddMemberOpen(true)}
              className="btn btn-xs btn-primary"
              >Add Member</button>
              <button
              onClick={()=>setIsManageOpen(true)}
              className="btn btn-xs btn-secondary"
              >
                Manage
              </button>
              </div>
          )}
          {selectedUser.isGroup && selectedUser.adminId !== authUser._id && (
            <button
            onClick={async()=>{
              if(window.confirm("Are you sure you want to leave this group ? ")){
                await useChatStore.getState().removeMember(selectedUser._id,authUser._id)
                setSelected(null)
              }
            }}
            className="btn btm-xs btn-error btn-outline mr-2"
            >
              Leave
            </button>
          )}
          {/* Close Chat Button */}
          <button onClick={() => setSelected(null)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X />
          </button>
        </div>
      </div>
      {
        isTyping && !selectedUser.isGroup && (
          <span className="text-sm text-green-500 italic">
            Typing...
          </span>
        )}

      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
   <ManageGroupModal isOpen={isManageOpen} onClose={()=>setIsManageOpen(false)}/>
    </div>
  );
};

export default ChatHeader;
