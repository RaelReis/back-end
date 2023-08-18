import { prismaClient } from "../database/primsaClient";
import { Context } from "../server";

const userFieldResolvers = {
  diaries: async (_root: any, _: any, { id }: Context) => {
    const diaries = await prismaClient.diary.findMany({
      where: {
        userId: id,
      },
    });
    return diaries;
  },
  weeklies: async (_root: any, _: any, { id }: Context) => {
    const weeklies = await prismaClient.weekly.findMany({
      where: {
        userId: id,
      },
    });
    return weeklies;
  },
};

export const fieldResolvers = {
  User: {
    ...userFieldResolvers,
  },
};
