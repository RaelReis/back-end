import { Context } from "../../context";

const userFieldResolvers = {
  diaries: async ({ id: userId }: any, _: any, { userApi }: Context) => {
    const diaries = await userApi.getDiaries(userId);
    return diaries;
  },
  weeklies: async ({ id: userId }: any, _: any, { userApi }: Context) => {
    const weeklies = await userApi.getWeeklies(userId);
    return weeklies;
  },
};

export const fieldResolvers = {
  User: {
    ...userFieldResolvers,
  },
};
