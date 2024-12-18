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

  getCurrentLogedinUsers: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const id = context.user.id;
      const user = await UserService.getUserById(id);
      return user;
    }
    console.log(context);
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = { quries, mutations };
