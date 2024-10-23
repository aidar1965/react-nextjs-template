// src/api/posts.ts
import { makeRequest } from "@/api/utils/clientApiClient";
import Post from "../../app/models/Post";
import { RequestGetPosts } from "@/api/interfaces/requests/getPostsRequest";
import { PostListItem } from "@/api/interfaces/responses/PostListItem";

export const fetchPosts = async (page: number): Promise<Post[]> => {
  const posts = await makeRequest<PostListItem[], Post[]>(
    new RequestGetPosts(page)
  );

  return posts;
};
