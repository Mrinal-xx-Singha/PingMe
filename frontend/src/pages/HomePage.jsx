import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  const [isSidebarCollapsed,setIsSidebarCollapsed] =useState(false)

  return (
    <div className="min-h-screen bg-base-200 py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-base-100 rounded-2xl shadow-cl w-full overflow-hidden">
          <div className="flex h-[calc(100vh-10rem)] max-h-[900px] rounded-lg">
           {/* Pass teh state as props to the sidebar  */}
            <Sidebar isCollapsed={isSidebarCollapsed}
            toggleCollapse={()=>setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            {/* This middle section will automatically grow when the sidebar shrinks */}
           
           <div className="flex flex-1 flex-col min-w-0">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
           </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
