import { Post } from "./types";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const fetchPosts = async (page: number): Promise<Post[]> => {
  try {
    const response = await axiosInstance.get(`/api/posts/?_page=${page}`, {
      baseURL: "",
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Posts fetching error:", error);
    throw new Error("Failed to fetch posts");
  }
};
