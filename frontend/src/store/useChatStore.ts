import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// Example types — adjust fields to match your backend
export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string | null;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string | null;
  createdAt: string;
}

interface ChatState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: { content: string }) => Promise<void>;
  setSelectedUser: (user: User | null) => void;

  subscribeToMessages: () => void;
  unsubscribeToMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async (): Promise<void> => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get<User[]>("/messages/users");
      const users = Array.isArray(response.data) ? response.data : [];
      set({ users });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string): Promise<void> => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get<Message[]>(
        `/messages/${userId}`
      );
      const messages = Array.isArray(response.data) ? response.data : [];
      set({ messages });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: { content: string }): Promise<void> => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }
    try {
      const response = await axiosInstance.post<Message>(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, response.data] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage: Message) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId !== selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user: User | null) => set({ selectedUser: user }),
}));
