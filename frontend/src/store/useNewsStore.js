import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useNewsStore = create((set) => ({
    articles: [],
    isNewsLoading: false,

    fetchNews: async () => {
        set({ isNewsLoading: true })
        try {

            const res = await axiosInstance.get("/news")
            set({ articles: res.data })
        } catch (error) {
            console.error("Error fetching News", error)
            toast.error("Failed to load social media news")

        } finally {
            set({ isNewsLoading: false })
        }
    }
}))