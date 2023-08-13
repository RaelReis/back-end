import { Context } from "../../server";

const resolvers = {
  user: async (_root: any, _args: any, { userApi, userId }: Context) => {
    const user = await userApi.getUser(userId);
    return user;
  },
  users: async (_root: any, _args: any, { userApi }: Context) => {
    const users = await userApi.getUsers({});
    return users;
  },
  diaries: async (_root: any, _args: any, { userApi, userId }: Context) => {
    const diaries = await userApi.getDiaries(userId);
    return diaries;
  },
  weeklies: async (_root: any, _args: any, { userApi, userId }: Context) => {
    const weeklies = await userApi.getWeeklies(userId);
    return weeklies;
  },
};

export const queryResolvers = {
  Query: resolvers,
};
