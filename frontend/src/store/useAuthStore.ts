import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// Example type for your user — adjust fields to match your backend
export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string | null;
}

// Input types for signup/login/update
export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  password?: string;
}

interface AuthState {
  authUser: AuthUser | null;
  onlineUsers: AuthUser[];
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  onlineUsers: [],
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get<AuthUser>("/auth/check");
      set({ authUser: response.data });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignupData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post<AuthUser>("/auth/signup", data);
      set({ authUser: response.data });
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post<AuthUser>("/auth/login", data);
      set({ authUser: response.data });
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data: UpdateProfileData) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put<AuthUser>(
        "/auth/update-profile",
        data
      );
      set({ authUser: response.data });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
