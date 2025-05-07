import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "dark", // Default theme is dark
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("chat-theme", theme); // Save the theme to local storage
  },
}));