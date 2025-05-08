import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";


export const useAuthStore = create((set, get) => ({

    authUser: null,
    authToken: null,
    provider: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    onlineUsers: [],

    isProviderSignup: false,
    isProvirderLogin: false,

    socket: null,

    // Update the auth user in the store
    updateAuthUser: (updatedUser) => {
        set({ authUser: updatedUser });
    },

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/checkAuth');
            set({
                authUser: res.data.user,
                isCheckingAuth: false,
            });

            get().connectSocket(); // Connect to socket after checking auth
            return { success: true };
        } catch (err) {
            console.log("Error in checkAuth", err);
            if (err.response?.status === 401) {
                set({ authUser: null });
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (Data) => {
        set({ isSigningUp: true });
        try {

            const res = await axiosInstance.post('/auth/signup', Data);
            set({
                authUser: res.data.user,
                authToken: res.data.token,
            });

            toast.success("Signup successful!");

            get().connectSocket(); // Connect to socket after sigunup

            return { success: true, redirectUrl: res.data.redirectUrl || '/' };
        } catch (err) {
            console.log("Error in signup", err);
            toast.error(err.response.data.message || "Signup failed!");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (Data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', Data);
            set({
                authUser: res.data.user,
                authToken: res.data.token,
            });

            toast.success("Login successful!");

            get().connectSocket(); // Connect to socket after login

            return { success: true, redirectUrl: res.data.redirectUrl || '/' };
        } catch (err) {
            console.log("Error in login", err);
            toast.error(err.response.data.message || "Login failed!");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post('/auth/logout');
            set({ authUser: null, authToken: null });
            toast.success(res.data.message || "Logout successful!");

            get().disconnectSocket(); // Disconnect from socket after logout

            return { success: true, redirectUrl: '/login' };
        } catch (err) {
            console.log("Error in logout", err);
            toast.error(err.response.data.message || "Logout failed!");
        }
    },


    providerSignup: async (provider) => {
        return new Promise((resolve) => {
            // Listen for the event before calling the login
            window.electron.on('oauth-complete', () => {
                console.log('OAuth completed');
                resolve({ success: true, redirectUrl: '/' });
            });

            // Trigger the OAuth login process
            window.electron.invoke('oauth-login', provider);
        });
    },

    connectSocket: () => {
        const { authUser, authToken } = get();
        if (!authUser || !authToken) return;
        
        // Don't create a new connection if one already exists and is connected
        if (get().socket?.connected) return;

        // If there's a socket instance but it's not connected, clean it up
        if (get().socket) {
            get().socket.removeAllListeners();
            get().socket.close();
        }

        let URL = __API_URL__.replace(/\/api\/?$/, '');

        console.log("Connecting to socket...", URL);
        const socket = io(URL, {
            withCredentials: true,
            transports: ["websocket", "polling"], // Try websocket first, fallback to polling
            auth: {
                token: authToken,
            },
            query: {
                userId: authUser._id,
            },
reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
toast.success("Connected to chat server", { id: "socket-connection" });
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
            toast.error("Connection error: " + error.message, { id: "socket-error" });
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
            
            // Show different messages based on disconnect reason
            if (reason === "io server disconnect") {
                // The server has forcefully disconnected the socket
                toast.error("Disconnected from server", { id: "socket-disconnect" });
                // Server disconnected, so try to reconnect manually
                socket.connect();
            } else if (reason === "transport close" || reason === "ping timeout") {
                // Connection lost, but reconnection will be attempted automatically
                toast.error("Connection lost. Reconnecting...", { id: "socket-reconnecting" });
            }
        });

        socket.on("reconnect", (attemptNumber) => {
            console.log(`Socket reconnected after ${attemptNumber} attempts`);
            toast.success("Reconnected to chat server", { id: "socket-reconnect" });
        });

        socket.on("reconnect_attempt", (attemptNumber) => {
            console.log(`Reconnection attempt #${attemptNumber}`);
        });

        socket.on("reconnect_error", (error) => {
            console.error("Socket reconnection error:", error);
        });

        socket.on("reconnect_failed", () => {
            console.error("Socket failed to reconnect after all attempts");
            toast.error("Could not reconnect to server. Please refresh the page.", { 
                id: "socket-reconnect-failed",
                duration: 10000 
            });
        });

        set({ socket: socket });

        socket.on("getOnlineUser", (userIds) => {
            set({ onlineUsers: userIds });
        });

        socket.on("join-room", (roomId) => {
            console.log("Joined room:", roomId);
            socket.join(roomId);
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect(); //disconnects only if a socket is open
    },

}));