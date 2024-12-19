import { prismaClient } from "../lib/db";

export interface createPostPayload {
  postTitle: string;
  postDescription: string;
  postCreationDate?: number;
  postAuthor: string;
}

class PostService {
  /**
   * static createPost
   */
  public static createPost(payload: createPostPayload) {
    const { postAuthor, postDescription, postTitle, postCreationDate } =
      payload;

    return prismaClient.create({
      postAuthor,
      postDescription,
      postTitle,
      postCreationDate,
    });
  }
}
