import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const axiosInstance = axios.create({
    baseURL: `${__API_URL__}`,
})

// Attach token from Zustand
axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().authToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})