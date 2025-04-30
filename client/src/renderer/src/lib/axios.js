import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: `${__API_URL__}`,
    withCredentials: true,
})