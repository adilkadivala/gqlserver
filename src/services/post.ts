import { prismaClient } from "../lib/db";
import redis from "../lib/redis";

export interface createPostPayload {
  postTitle: string;
  postDescription: string;
  postCreationDate?: number;
  postAuthor?: string;
}
export interface getPostPayload {
  postTitle: string;
  postDescription: string;
}

class PostService {
  /**
   * static createPost
   */
  public static async createPost(payload: createPostPayload) {
    const { postAuthor, postDescription, postTitle, postCreationDate } =
      payload;

    const newPosts = await prismaClient.post.create({
      data: {
        postDescription,
        postTitle,
      },
    });

    // adding data in redis
    await redis.del("posts");

    return newPosts;
  }

  /**
   * static getPost
   */
  public static async getPost(payload: getPostPayload) {
    const { postDescription, postTitle } = payload;

    // Generate a cache key
    const cacheKey = `post:${postTitle}:${postDescription}`;

    // Check if data exists in cache
    const cachedPost = await redis.get(cacheKey);
    if (cachedPost) {
      console.log("Serving from cache");
      return JSON.parse(cachedPost);
    }

    // Fetch data from the database
    const posts = await prismaClient.post.findMany({
      where: { postTitle, postDescription },
    });

    // Store result in cache for future requests
    await redis.set(cacheKey, JSON.stringify(posts), "EX", 3600); // Cache for 1 hour

    return posts;
  }
}

export default PostService;
