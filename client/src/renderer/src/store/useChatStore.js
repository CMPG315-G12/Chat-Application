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
    typingUsers: {}, // Track users who are currently typing
    typingTimeout: null, // Store timeout reference

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

    // Handle typing indicators
    setTyping: (isTyping) => {
        const { selectedContact, selectedContactType, typingTimeout } = get();
        const socket = useAuthStore.getState().socket;
        
        if (!socket || !selectedContact) return;
        
        // Clear existing timeout if any
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        
        if (selectedContactType === "U") {
            if (isTyping) {
                socket.emit("typing:start:user", { recipientId: selectedContact._id });
                
                // Set a timeout to automatically stop typing indicator after inactivity
                const timeout = setTimeout(() => {
                    socket.emit("typing:stop:user", { recipientId: selectedContact._id });
                }, 3000);
                
                set({ typingTimeout: timeout });
            } else {
                socket.emit("typing:stop:user", { recipientId: selectedContact._id });
                set({ typingTimeout: null });
            }
        } 
        else if (selectedContactType === "G") {
            if (isTyping) {
                socket.emit("typing:start:group", { groupId: selectedContact.groupCode });
                
                // Set a timeout to automatically stop typing indicator after inactivity
                const timeout = setTimeout(() => {
                    socket.emit("typing:stop:group", { groupId: selectedContact.groupCode });
                }, 3000);
                
                set({ typingTimeout: timeout });
            } else {
                socket.emit("typing:stop:group", { groupId: selectedContact.groupCode });
                set({ typingTimeout: null });
            }
        }
    },

    getMessages: async (contactId) => {
        set({ isMessagesLoading: true });
        const { selectedContactType } = get();

        if (selectedContactType === "U") {
            try {
                const res = await axiosInstance.get(`/message/u/${contactId}`);
                set({ messages: res.data });
                
                // Mark messages from this contact as delivered when viewed
                await get().markMessagesAsDelivered(contactId);
                
                // Start tracking when messages are read
                get().trackMessageReading(contactId);
                
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

    // Mark messages as delivered
    markMessagesAsDelivered: async (senderId) => {
        try {
            await axiosInstance.post(`/message/delivered/${senderId}`);
        } catch (err) {
            console.error("Error marking messages as delivered:", err);
        }
    },
    
    // Mark messages as read
    markMessagesAsRead: async (senderId) => {
        try {
            await axiosInstance.post(`/message/read/${senderId}`);
        } catch (err) {
            console.error("Error marking messages as read:", err);
        }
    },
    
    // Track when messages are actually read (user has viewed them)
    trackMessageReading: (senderId) => {
        // We'll use Intersection Observer API to detect when messages are visible
        const readObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Message is visible in viewport, mark it as read
                    const messageId = entry.target.dataset.messageId;
                    const messageData = JSON.parse(entry.target.dataset.message || '{}');
                    
                    if (messageData && messageData.senderId === senderId) {
                        get().markMessagesAsRead(senderId);
                        
                        // Stop observing this message once it's marked as read
                        readObserver.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.5 }); // Message is considered read when 50% visible
        
        // Store the observer in the state so it can be cleaned up later
        set({ readObserver });
        
        return readObserver;
    },
    
    // Clean up the observer when changing conversations
    cleanupReadObserver: () => {
        const { readObserver } = get();
        if (readObserver) {
            readObserver.disconnect();
            set({ readObserver: null });
        }
    },

    sendMessage: async (data) => {
        const { selectedContact, messages, selectedContactType } = get();

        // Clear typing indicator when sending a message
        get().setTyping(false);

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

            // Listen for typing events in group
            socket.on("typing:group", ({ groupId, users }) => {
                if (groupId === selectedContact.groupCode) {
                    // Filter out current user from typing users
                    const currentUserId = useAuthStore.getState().authUser._id;
                    const otherTypingUsers = users.filter(userId => userId !== currentUserId);
                    
                    set({ typingUsers: otherTypingUsers });
                }
            });

        } else if (selectedContactType === "U") {
            socket.on("UserMessage", (newMessage) => {
                const isMessageSentFromSelectedUser = newMessage.senderId === selectedContact._id;
                if (!isMessageSentFromSelectedUser) return;

                // Mark message as delivered as soon as it's received
                get().markMessagesAsDelivered(selectedContact._id);
                
                set({
                    messages: [...get().messages, newMessage],
                });
            });

            // Listen for typing events from direct message partner
            socket.on("typing:user", ({ userId, isTyping }) => {
                if (userId === selectedContact._id) {
                    set({ 
                        typingUsers: isTyping ? [userId] : [] 
                    });
                }
            });

            // Listen for message status updates
            socket.on("messages:delivered", ({ userId, messageIds }) => {
                if (userId !== selectedContact._id) return;
                
                const updatedMessages = get().messages.map(msg => {
                    if (msg.senderId === useAuthStore.getState().authUser._id && msg.status === 'sent') {
                        return { ...msg, status: 'delivered' };
                    }
                    return msg;
                });
                
                set({ messages: updatedMessages });
            });
            
            socket.on("messages:read", ({ userId, messageIds }) => {
                if (userId !== selectedContact._id) return;
                
                const updatedMessages = get().messages.map(msg => {
                    if (messageIds.includes(msg._id)) {
                        return { 
                            ...msg, 
                            status: 'read',
                            readBy: [...(msg.readBy || []), { 
                                userId, 
                                readAt: new Date() 
                            }]
                        };
                    }
                    return msg;
                });
                
                set({ messages: updatedMessages });
            });
        } else {
            console.error("Invalid contact type selected.");
            return;
        }

    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        const { selectedContact, selectedContactType, typingTimeout } = get();

        // Clean up read tracking
        get().cleanupReadObserver();

        // Clear any active typing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Reset typing indicator state
        set({ typingUsers: {}, typingTimeout: null });

        if (!selectedContact) return;
        if (!socket) return;

        if (selectedContactType === "G") {
            console.log("Code: ", selectedContact.groupCode);

            socket.emit("leave-room", selectedContact.groupCode);
            socket.off("GroupMessage");
            socket.off("typing:group");
        } else if (selectedContactType === "U") {
            socket.off("UserMessage");
            socket.off("typing:user");
            socket.off("messages:delivered");
            socket.off("messages:read");
        }
    },

}));
