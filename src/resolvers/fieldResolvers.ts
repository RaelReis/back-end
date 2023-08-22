import { prismaClient } from "../database/primsaClient";
import { Context } from "../server";

const userFieldResolvers = {
  dailies: async (_root: any, _: any, { id }: Context) => {
    const dailies = await prismaClient.daily.findMany({
      where: {
        userId: id,
      },
    });
    return dailies;
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
