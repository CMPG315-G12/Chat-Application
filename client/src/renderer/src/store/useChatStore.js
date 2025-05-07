import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getMessagesG } from "../../../../../server/src/controllers/message.controller";


export const useChatStore = create((set) => ({
    messages: [],
    contacts: [],
    selectedContact: null,
    selectedContactType: null,
    isContactsListLoading: false,
    isMessagesLoading: false,

    //todo: fix
    setSelectedContact: (contact) => set({ selectedContact: contact }),
    setSelectedContactType: (type) => set({ selectedContactType: type }),

    getContacts: async () => {
        set({ isChatListLoading: true });
        try {
            const res = await axiosInstance.get("/message/contacts");
            console.log("Contacts: ", res.data);
            set({ contacts: res.data });
        } catch (err) {
            toast.error(err.response.data.message || "Error fetching Contacts");
        } finally {
            set({ isChatListLoading: false });
        }
    },

    getMessages: async (contactId) => {
        set({ isMessagesLoading: true });
        const { selectedContactType } = useChatStore.getState();
        
        if (selectedContactType === "U") {
            try {
                const res = await axiosInstance.get(`/message/u/${contactId}`);
                set({ messages: res.data });
            } catch (err) {
                toast.error(err.response.data.message || "Error fetching messages");
            } finally {
                set({ isMessagesLoading: false });
            }
        }
        else if (selectedContactType === "G") {
            try {
                const res = await axiosInstance.get(`/message/g/${contactId}`);
                set({ messages: res.data });
            } catch (err) {
                toast.error(err.response.data.message || "Error fetching messages");
            } finally {
                set({ isMessagesLoading: false });
            }
        } else {
            toast.error("Invalid contact type selected.");
            set({ isMessagesLoading: false });
        }
    },
}));
