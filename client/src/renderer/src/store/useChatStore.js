import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";



export const useChatStore = create((set, get) => ({
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
        const { selectedContactType } = get();

        if (selectedContactType === "U") {
            try {
                const res = await axiosInstance.get(`/message/u/${contactId}`);
                set({ messages: res.data });
                console.log("Messages: ", res.data);
            } catch (err) {
                toast.error(err.response.data.message || "Error fetching messages");
            } finally {
                set({ isMessagesLoading: false });
            }
        }
        else if (selectedContactType === "G") {
            try {
                const res = await axiosInstance.get(`/message/g/${contactId}`);
                console.log("Messages: ", res.data);

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

    sendMessage: async (data) => {
        const { selectedContact, messages, selectedContactType } = get();

        if (selectedContactType === "U") {
            try {
                const res = await axiosInstance.post(`/message/send/u/${selectedContact._id}`, data);
                set({ messages: [...messages, res.data] });
            } catch (err) {
                toast.error(err.response.data.message || "Error sending message");
            } 
        }
        else if (selectedContactType === "G") {
            try {
                const res = await axiosInstance.post(`/message/send/g/${selectedContact._id}`, data);
                set({ messages: [...messages, res.data] });
            } catch (err) {
                toast.error(err.response.data.message || "Error sending message");
            }
        } else {
            toast.error("Invalid contact type selected.");

        }
    },

    subscribeToMessages: () => {
        const { selectedContact, selectedContactType } = get();
        if (!selectedContact) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.warn("Socket not connected yet.");
            return;
        }


        if (selectedContactType === "G") {

            socket.emit("join-room", selectedContact.groupCode);

            socket.on("GroupMessage", (newMessage) => {

                set({
                    messages: [...get().messages, newMessage.message],
                });
            });

        } else if (selectedContactType === "U") {
            socket.on("UserMessage", (newMessage) => {
                console.log("New message: ", newMessage);
                // const isMessageSentFromSelectedUser = newMessage.senderId === selectedContact._id;
                // if (!isMessageSentFromSelectedUser) return;

                set({
                    messages: [...get().messages, newMessage.message],
                });
            });
        } else {
            console.error("Invalid contact type selected.");
            return;
        }

    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        const { selectedContact, selectedContactType } = get();

        if (!selectedContact) return;
        if (!socket) return;

        if (selectedContactType === "G") {
            console.log("Code: ", selectedContact.groupCode);

            socket.emit("leave-room", selectedContact.groupCode);
            socket.off("GroupMessage");
        } else if (selectedContactType === "U") {
            socket.off("UserMessage");
        }
    },

}));
