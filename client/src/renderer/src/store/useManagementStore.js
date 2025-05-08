import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useManagementStore = create((set, get) => ({
    //store to handle the adding removing and creation of groups
    groupCode: null,
    isGroupsLoading: false,
    isUserLoading: false,
    searchResults: [],
    isSearching: false,
    friendRequestSent: false,
    
    // Search for users by email or username
    searchUsers: async (query) => {
        if (!query) return;
        
        set({ isSearching: true });
        try {
            const res = await axiosInstance.get(`/auth/search?q=${encodeURIComponent(query)}`);
            set({ searchResults: res.data });
            return res.data;
        } catch (err) {
            console.error("Error searching users:", err);
            toast.error("Failed to search users");
            return [];
        } finally {
            set({ isSearching: false });
        }
    },
    
    // Clear search results
    clearSearchResults: () => set({ searchResults: [] }),

    // Add friend by email or ID
    addFriend: async (emailOrId) => {
        set({ isUserLoading: true, friendRequestSent: false });
        try {
            let userId = emailOrId;
            
            // If it's an email, we need to search for the user ID first
            if (emailOrId.includes('@')) {
                const users = await get().searchUsers(emailOrId);
                const user = users.find(u => u.email === emailOrId);
                if (!user) {
                    toast.error("User with this email not found");
                    set({ isUserLoading: false });
                    return false;
                }
                userId = user._id;
            }
            
            const res = await axiosInstance.post(`/message/u/add/${userId}`);
            toast.success("Friend request sent successfully!");
            set({ friendRequestSent: true });
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error adding friend";
            toast.error(errorMessage);
            return false;
        } finally {
            set({ isUserLoading: false });
        }
    },

    removeFriend: async (userId) => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.post(`/message/u/remove/${userId}`);
            toast.success("Friend removed successfully!");
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error removing friend";
            toast.error(errorMessage);
            return false;
        } finally {
            set({ isUserLoading: false });
        }
    },
    
    // Group management functions with improved error handling and validation
    joinGroup: async (groupCode) => {
        if (!groupCode || groupCode.trim() === '') {
            toast.error("Group code is required");
            return false;
        }
        
        set({ isGroupsLoading: true });
        try {
            const res = await axiosInstance.post(`/message/g/join/${groupCode}`);
            toast.success("Joined group successfully!");
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error joining group";
            toast.error(errorMessage);
            return false;
        } finally {
            set({ isGroupsLoading: false });
        }
    },

    leaveGroup: async (groupCode) => {
        if (!groupCode) {
            toast.error("Invalid group code");
            return false;
        }
        
        set({ isGroupsLoading: true });
        try {
            const res = await axiosInstance.post(`/message/g/leave/${groupCode}`);
            toast.success("Left group successfully!");
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error leaving group";
            toast.error(errorMessage);
            return false;
        } finally {
            set({ isGroupsLoading: false });
        }
    },

    createGroup: async (groupName, groupDescription = "") => {
        if (!groupName || groupName.trim() === '') {
            toast.error("Group name is required");
            return false;
        }
        
        set({ isGroupsLoading: true });
        try {
            const res = await axiosInstance.post("/message/create/group", {
                groupName,
                groupDescription,
            });
            set({ groupCode: res.data.groupCode });
            toast.success("Group created successfully!");
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error creating group";
            toast.error(errorMessage);
            return false;
        } finally {
            set({ isGroupsLoading: false });
        }
    },
    
    // Group invitation functionality
    inviteToGroup: async (groupCode, userEmail) => {
        if (!groupCode || !userEmail) {
            toast.error("Group code and user email are required");
            return false;
        }
        
        set({ isGroupsLoading: true });
        try {
            const res = await axiosInstance.post(`/message/g/invite`, {
                groupCode,
                userEmail
            });
            toast.success("Invitation sent successfully!");
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error sending invitation";
            toast.error(errorMessage);
            return false;
        } finally {
            set({ isGroupsLoading: false });
        }
    },
}))