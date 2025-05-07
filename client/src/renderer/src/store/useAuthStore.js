import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';


export const useAuthStore = create((set) => ({

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

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/checkAuth'); 
           set({
                authUser: res.data.user,
                isCheckingAuth: false,
            });

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
      }
}));