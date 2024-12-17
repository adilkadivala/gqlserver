import UserService, {
  CreateUserPayload,
  getUserPayload,
} from "../../services/user";

const quries = {
  getUserToken: async (_: any, payload: getUserPayload) => {
    const token = await UserService.getUser({
      email: payload.email,
      password: payload.password,
    });
    return token;
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = { quries, mutations };
