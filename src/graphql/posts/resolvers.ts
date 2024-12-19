import PostService, {
  createPostPayload,
  getPostPayload,
} from "../../services/post";

const quries = {
  getPost: async (_: any, payload: getPostPayload) => {
    const token = await PostService.getPost({
      postTitle: payload.postTitle,
      postDescription: payload.postDescription,
    });
    return token;
  },
};

const mutations = {
  createPost: async (_: any, payload: createPostPayload) => {
    const res = await PostService.createPost(payload);
    return res.id;
  },
};

export const resolvers = { quries, mutations };
