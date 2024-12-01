import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();
  // reference to scroll imediately
  const messageEndRef = useRef(null);

  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    unsubscribeFromMessages,
    subscribeToMessages,
  ]);
  // scroll down when new msg comes realtime
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === authUser._id;
          const profilePic = isCurrentUser
            ? authUser.profilePic || "/avatar.png"
            : selectedUser.profilePic || "/avatar.png";

          return (
            <div
              key={message._id}
              ref={messageEndRef}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-start gap-3 max-w-[80%]">
                {!isCurrentUser && (
                  <div className="size-10 rounded-full overflow-hidden shrink-0">
                    <img
                      src={profilePic}
                      alt="profile-pic"
                      className="size-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col items-end">
                  <div
                    className={`
                      rounded-2xl px-4 py-2.5 shadow-sm
                      ${
                        isCurrentUser
                          ? "bg-primary text-primary-content"
                          : "bg-base-200 text-base-content"
                      }
                    `}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="attachment"
                        className="max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && (
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    )}
                  </div>

                  <time className="text-[10px] text-base-content/60 mt-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>

                {isCurrentUser && (
                  <div className="size-10 rounded-full overflow-hidden shrink-0">
                    <img
                      src={profilePic}
                      alt="profile-pic"
                      className="size-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
