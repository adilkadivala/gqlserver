import { prismaClient } from "../lib/db";

export interface createPostPayload {
  postTitle: string;
  postDescription: string;
  postCreationDate?: number;
  postAuthor: string;
}
export interface getPostPayload {
  postTitle: string;
  postDescription: string;
}

class PostService {
  /**
   * static createPost
   */
  public static createPost(payload: createPostPayload) {
    const { postAuthor, postDescription, postTitle, postCreationDate } =
      payload;

    return prismaClient.post.create({
      data: {
        postDescription,
        postTitle,
      },
    });
  }

  /**
   * static getPost
   */
  public static getPost(payload: getPostPayload) {
    const { postDescription, postTitle } = payload;

    return prismaClient.post.findMany({
      where: { postTitle, postDescription },
    });
  }
}

export default PostService;
