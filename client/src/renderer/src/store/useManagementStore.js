import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useManagementStore = create((set) => ({
    //store to handle the adding removing and creation of groups
    groupCode: null,
    isGroupsLoading: false,
    isUserLoading: false,
 

    joinGroup: async (groupCode) => {
        set({ isGroupsLoading: true });
        try {
            const res = await axiosInstance.post(`/message/g/join/${groupCode}`);
            toast.success("Joined group successfully!");
        } catch (err) {
            toast.error(err.response.data.message || "Error joining group");
        } finally {
            set({ isGroupsLoading: false });
        }
    },

    leaveGroup: async (groupCode) => {
        set({ isGroupsLoading: true });
        try {
            const res = await axiosInstance.post(`/message/g/leave/${groupCode}`);
            toast.success("Left group successfully!");
        } catch (err) {
            toast.error(err.response.data.message || "Error leaving group");
        } finally {
            set({ isGroupsLoading: false });
        }
    },

    createGroup: async (groupName, groupDescription) => {
        set({ isGroupsLoading: true });
        try {
            const res = await axiosInstance.post("/message/create/group", {
                groupName,
                groupDescription,
            });
            set({ groupCode: res.data.groupCode });
            toast.success("Group created successfully!");
        } catch (err) {
            toast.error(err.response.data.message || "Error creating group");
        } finally {
            set({ isGroupsLoading: false });
        }
    },

    addFriend: async (userId) => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.post(`/message/u/add/${userId}`);
            toast.success("Friend added successfully!");
        } catch (err) {
            toast.error(err.response.data.message || "Error adding friend");
        } finally {
            set({ isUserLoading: false });
        }
    },

    removeFriend: async (userId) => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.post(`/message/u/remove/${userId}`);
            toast.success("Friend removed successfully!");
        } catch (err) {
            toast.error(err.response.data.message || "Error removing friend");
        } finally {
            set({ isUserLoading: false });
        }
    },

}))