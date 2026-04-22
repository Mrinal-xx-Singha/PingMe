import React, { useEffect, useRef, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    loadMoreMessages,
    isMessagesLoading,
    isLoadingMoreMessages,
    hasMoreMessages,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();

  // Ref to scroll to on initial load / new real-time message
  const messageEndRef = useRef(null);
  // Sentinel div at the top of the message list — triggers Intersection Observer
  const topSentinelRef = useRef(null);
  // Track whether this is the first render for a given conversation
  const isInitialLoad = useRef(true);
  // Keep track of the scroll container to restore position after prepend
  const scrollContainerRef = useRef(null);

  // Fetch messages and set up socket subscription when selected user changes
  useEffect(() => {
    isInitialLoad.current = true;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to bottom on initial load OR when a new real-time message arrives
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    if (isInitialLoad.current) {
      // Jump instantly to the bottom so the chat opens at the latest message
      messageEndRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialLoad.current = false;
    } else if (!isLoadingMoreMessages) {
      // A new real-time message arrived — smooth scroll to bottom
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoadingMoreMessages]);

  // IntersectionObserver — fires when the top sentinel enters the viewport
  const handleTopSentinel = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMoreMessages && !isLoadingMoreMessages) {
        const container = scrollContainerRef.current;
        // Capture scroll height before prepend so we can restore position
        const prevScrollHeight = container ? container.scrollHeight : 0;

        loadMoreMessages(selectedUser._id).then(() => {
          if (container) {
            // Restore scroll position so the viewport doesn't jump to top
            container.scrollTop = container.scrollHeight - prevScrollHeight;
          }
        });
      }
    },
    [hasMoreMessages, isLoadingMoreMessages, loadMoreMessages, selectedUser._id]
  );

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleTopSentinel, {
      root: scrollContainerRef.current,
      threshold: 0.1,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleTopSentinel]);

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

      {/* Scrollable message list */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {/* Top sentinel — observed to trigger loading older messages */}
        <div ref={topSentinelRef} />

        {/* Spinner shown while loading older messages */}
        {isLoadingMoreMessages && (
          <div className="flex justify-center py-2">
            <span className="loading loading-spinner loading-sm text-primary" />
            <span className="text-xs text-base-content/50 ml-2">Loading older messages…</span>
          </div>
        )}

        {/* "You've reached the beginning" label when no more messages remain */}
        {!hasMoreMessages && messages.length > 0 && (
          <p className="text-center text-xs text-base-content/40 py-2">
            ✓ Beginning of conversation
          </p>
        )}

        {messages.map((message) => {
          const isCurrentUser = message.senderId === authUser._id;
          const profilePic = isCurrentUser
            ? authUser.profilePic || "/avatar.png"
            : selectedUser.profilePic || "/avatar.png";

          return (
            <div
              key={message._id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-start gap-3 max-w-[80%]">
                {!isCurrentUser && (
                  <div className="size-10 rounded-full overflow-hidden shrink-0">
                    <img src={profilePic} alt="profile-pic" className="size-full object-cover" />
                  </div>
                )}

                <div className="flex flex-col items-end">
                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                      isCurrentUser
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content"
                    }`}
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
                    <img src={profilePic} alt="profile-pic" className="size-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Bottom anchor — scrolled into view on new messages */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;

