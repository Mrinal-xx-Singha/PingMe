import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUsers: [],
  groups: [],
  isGroupLoading: false,
  // --- Pagination state ---
  hasMoreMessages: false,
  isLoadingMoreMessages: false,
  oldestMessageId: null, // cursor: _id of the oldest message currently loaded

  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return
    socket.on('userTyping', ({ senderId }) => {
      set((state) => ({
        typingUsers: [...new Set([...state.typingUsers, senderId])]
      }))

    })

    socket.on("userStoppedTyping", ({ senderId }) => {
      // Remove user from typing list 
      set((state) => ({
        typingUsers: state.typingUsers.filter((id) => id !== senderId)
      }))
    })
  },
  unsubscribeFromTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return
    socket.off("userTyping")
    socket.off("userStoppedTyping")
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      console.log("Error getUsers", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getGroups: async () => {
    set({ isGroupLoading: true })
    try {
      const res = await axiosInstance.get("/groups")
      set({ groups: res.data })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups")

    } finally {
      set({ isGroupLoading: false })
    }

  },
  createGroup: async (groupData) => {
    try {
      const res = await axiosInstance.post("/groups", groupData)
      set({ groups: [...get().groups, res.data] })
      toast.success("Group created successfull!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group")
    }

  },

  // Initial load — resets pagination state for the selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true, messages: [], hasMoreMessages: false, oldestMessageId: null });
    try {
      const endPoint = get().selectedUser?.isGroup
        ? `/message/group/${userId}?limit=20` :
        `/message/${userId}?limit=20`
      const res = await axiosInstance.get(endPoint);
      const { messages, hasMore } = res.data;
      set({
        messages,
        hasMoreMessages: hasMore,
        oldestMessageId: messages.length > 0 ? messages[0]._id : null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Load older messages using the cursor — prepends to the existing list
  loadMoreMessages: async (userId) => {
    const { isLoadingMoreMessages, hasMoreMessages, oldestMessageId, messages } = get();
    if (isLoadingMoreMessages || !hasMoreMessages || !oldestMessageId) return;

    set({ isLoadingMoreMessages: true });
    try {
      const endPoint = get().selectedUser?.isGroup ? `/message/group/${userId}?limit=20&before=${oldestMessageId}` : `/message/${userId}?limit=20&before=${oldestMessageId}`
      const res = await axiosInstance.get(endPoint);

      const { messages: olderMessages, hasMore } = res.data;
      set({
        messages: [...olderMessages, ...messages], // prepend older messages
        hasMoreMessages: hasMore,
        oldestMessageId: olderMessages.length > 0 ? olderMessages[0]._id : oldestMessageId,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load more messages");
    } finally {
      set({ isLoadingMoreMessages: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const endPoint = selectedUser.isGroup ? `/message/group/send/${selectedUser._id}` : `/message/send/${selectedUser._id}`
      const res = await axiosInstance.post(endPoint, messageData);

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMsg) => {
      // If its a group check if the message belongs to this group 
      if (selectedUser.isGroup) {
        if (newMsg.groupId !== selectedUser._id) return
      } else {
        //  if direct message, check if its from the selected user
        if (newMsg.senderId !== selectedUser._id) return;
      }
      set({ messages: [...get().messages, newMsg] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelected: (selectedUser) => set({ selectedUser }),
}));
