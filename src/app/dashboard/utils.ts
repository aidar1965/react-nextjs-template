import { GetPostRequest } from "@/api/interfaces/requests/getPostsRequest";
import { Post } from "../dashboard/types";
import { executeRequest } from "@/api/utils/axios";

export const fetchPosts = async (page: number): Promise<Post[]> => {
  const postsRequest = new GetPostRequest({ page: page, limit: 10 });
  try {
    const response = await executeRequest<Post[]>(postsRequest);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Failed to login");
  }
};
