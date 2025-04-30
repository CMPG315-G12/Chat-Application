import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';


export const useAuthStore = create((set) => ({
    authUser: null,
    provider: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isChechingAuth: true,

    isProviderSignup: false,
    isProvirderLogin: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/checkAuth');
            console.log("Check Auth Response: ", res.data.user);

            set({
                authUser: res.data.user,
                isChechingAuth: false,
            });

        } catch (err) {
            console.log("Error in checkAuth",err);
            set({
                authUser: null,
            });
        } finally {
            set({ isChechingAuth: false });
        }
    },

    signup: async (Data) => {
        set({ isSigningUp: true });
        try {
            
            const res = await axiosInstance.post('/auth/signup', Data);
            set({
                authUser: res.data.user,
                isSigningUp: false,
            });

            toast.success("Signup successful!");
            window.location.href = res.data.redirectUrl || '/';
        } catch (err) {
            console.log("Error in signup", err);
            set({ isSigningUp: false });
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
                isLoggingIn: false,
            });

            toast.success("Login successful!");
            window.location.href = res.data.redirectUrl || '/';
        } catch (err) {
            console.log("Error in login", err);
            set({ isLoggingIn: false });
            toast.error(err.response.data.message || "Login failed!");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success(res.data.message || "Logout successful!");
            window.location.href = '/login';
        } catch (err) {
            console.log("Error in logout", err);
            toast.error(err.response.data.message || "Logout failed!");
        }
    },
    

    providerSignup: (provider) => {
        // Redirect the user to the backend's OAuth endpoint
        window.location.href = `${__API_URL__}/auth/${provider}`;
    },
}));