import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelected, isUsersLoading, getGroups, groups } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModelOpen,setIsModalOpen] = useState(false)

  useEffect(() => {
    getUsers();
    getGroups()
  }, [getUsers, getGroups]);

  // Filter the online/offlicec users 
  const mappedUsers = users.filter(user =>
    (!showOnlineOnly || onlineUsers.includes(user._id)) &&
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mappedGroups = groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(group => ({
      ...group,
      fullName: group.name, //map group.name to fullName 
      profilePic: group.groupPic, // map group.groupPic to profilePic
      isGroup: true, // our special flag 
    }))

  const sidebarItems = [...mappedGroups, ...mappedUsers]

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col bg-base-200 transition-all duration-200">
      <div className="border-b border-base-300 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
          <Users className="size-6 text-base-content/70" />
<span className="font-medium hidden lg:block text-base-content">Contacts</span>
          </div>
          <button
          onClick={()=>setIsModalOpen(true)}
          className="btn btn-sm btn-ghost btn-circle text-lg hidden lg:flex"
          >+</button>
        
        </div>

        {/* Search Input */}
        <div className="relative hidden lg:block">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
        </div>

        {/* Online Filter */}
        <div className="hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="text-sm text-base-content/80">Show online only</span>
          </label>
          <span className="text-xs text-base-content/60">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2">
        {sidebarItems.map((item) => (
          <button
            key={item._id}
            onClick={() => setSelected(item)}
            className={`
              w-full px-5 py-3 flex items-center gap-4 
              hover:bg-base-300 transition-colors group
              ${selectedUser?._id === item._id
                ? "bg-base-300 ring-1 ring-base-300"
                : "hover:bg-base-300/50"}
            `}
          >

            <div className="relative shrink-0">
              <img
                src={item.profilePic ||( item.isGroup ? "/group-image.jpeg" : "/avatar.png")}
                alt={item.name}
                className="size-12 object-cover rounded-full 
                  group-hover:scale-105 transition-transform
                  group-active:scale-95"
              />
              {onlineUsers.includes(item._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 
                  bg-green-500 rounded-full 
                  ring-2 ring-base-200"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate text-base-content">
                {item.fullName}
              </div>
              <div className="text-sm text-base-content/60">
                {onlineUsers.includes(item._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {sidebarItems.length === 0 && (
          <div className="text-center py-10 text-base-content/60">
            No contacts found
          </div>
        )}
      </div>
      <CreateGroupModal 
      isOpen={isModelOpen}
      onClose={()=>setIsModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;