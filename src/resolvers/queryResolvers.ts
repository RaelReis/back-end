import { Context } from "../server";
import { prismaClient } from "../database/primsaClient";

const resolvers = {
  user: async (_root: any, _args: any, { id }: Context) => {
    const user = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });
    return user;
  },
  users: async () => {
    const users = await prismaClient.user.findMany();
    return users;
  },
  diaries: async (_root: any, _args: any, { id }: Context) => {
    const diaries = await prismaClient.diary.findMany({
      where: {
        userId: id,
      },
    });
    return diaries;
  },
  weeklies: async (_root: any, _args: any, { id }: Context) => {
    const weeklies = await prismaClient.weekly.findMany({
      where: {
        userId: id,
      },
    });
    return weeklies;
  },
};

export const queryResolvers = {
  Query: resolvers,
};
