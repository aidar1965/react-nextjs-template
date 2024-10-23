// src/api/requests/RequestGetPosts.ts
import { BaseRequest } from "../../core/BaseRequest";
import { HttpMethod } from "../../core/types";
import { PostListItem } from "../responses/PostListItem";
import Post from "../../../app/models/Post";

export class RequestGetPosts extends BaseRequest<PostListItem, Post[]> {
  constructor(public page: number = 1, public limit: number = 10) {
    super({
      method: HttpMethod.GET,
      url: "/posts",
      params: {
        page,
        limit,
      },
    });
  }

  static fromResponse(response: PostListItem[]): Post[] {
    return response.map((item) => new Post(item.id, item.title, item.body));
  }
}
