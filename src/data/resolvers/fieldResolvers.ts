import { Context } from "../../server";

const userFieldResolvers = {
  diaries: async (_root: any, _: any, { userApi, userId }: Context) => {
    const diaries = await userApi.getDiaries(userId);
    return diaries;
  },
  weeklies: async (_root: any, _: any, { userApi, userId }: Context) => {
    const weeklies = await userApi.getWeeklies(userId);
    return weeklies;
  },
};

export const fieldResolvers = {
  User: {
    ...userFieldResolvers,
  },
};
