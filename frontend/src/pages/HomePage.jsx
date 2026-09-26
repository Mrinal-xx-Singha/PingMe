import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import NewsSidebar from "../components/NewsSidebar";

const HomePage = () => {
  const { selectedUser,subscribeToWatchParty,unsubscribeFromWatchParty  } = useChatStore();

  const [isSidebarCollapsed,setIsSidebarCollapsed] =useState(false)

  useEffect(()=>{
    subscribeToWatchParty()
    return()=>unsubscribeFromWatchParty()
  },[subscribeToWatchParty,unsubscribeFromWatchParty ])

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-0 lg:px-4 max-w-7xl h-[calc(100vh-5rem)]">
        <div className="bg-base-100 lg:rounded-2xl rounded-2xl shadow-xl w-full overflow-hidden lg:h-auto">
          <div className="flex h-full lg:h-[calc(100vh-10rem)] lg:max-h-[900px] rounded-lg">
           {/* Pass teh state as props to the sidebar  */}
           {/* Lft side bar hidden on mobile when a chat is open */}
           <div className={`${selectedUser ? 'hidden' : 'flex'} lg:flex`}>
            <Sidebar isCollapsed={isSidebarCollapsed}
            toggleCollapse={()=>setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            </div>
            {/* This middle section will automatically grow when the sidebar shrinks */}
           
           <div className={`${selectedUser ? 'flex' : 'hidden'} lg:flex flex-1 flex-col min-w-0`}>
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
           </div>
           <NewsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
