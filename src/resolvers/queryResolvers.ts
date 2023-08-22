import { Context } from "../server";
import { prismaClient } from "../database/primsaClient";
import { createUrlFromBuffer } from "../utils/createUrlFromBuffer";

const resolvers = {
  user: async (_root: any, _args: any, { id }: Context) => {
    const user = await prismaClient.user.findFirst({
      where: {
        id,
      },
      include: {
        goals: {
          include: {
            item: true,
          },
        },
      },
    });

    return {
      ...user,
      goals: user!.goals.map((goal) => ({
        ...goal,
        item: { ...goal.item, image: createUrlFromBuffer(goal.item.image) },
      })),
    };
  },
  users: async () => {
    const users = await prismaClient.user.findMany({
      include: {
        goals: true,
      },
    });
    return users;
  },
  dailies: async (_root: any, _args: any, { id }: Context) => {
    const dailies = await prismaClient.daily.findMany({
      where: {
        userId: id,
      },
    });
    return dailies;
  },
  weeklies: async (_root: any, _args: any, { id }: Context) => {
    const weeklies = await prismaClient.weekly.findMany({
      where: {
        userId: id,
      },
    });
    return weeklies;
  },
  item: async (_root: any, { id }: any) => {
    const item = await prismaClient.item.findFirst({
      where: {
        id,
      },
    });

    return { ...item, image: Buffer.from(item?.image!).toString("base64") };
  },
  items: async (_root: any, _args: any) => {
    const items = await prismaClient.item.findMany();
    return items.map((item) => ({ ...item, image: createUrlFromBuffer(item.image) }));
  },
  spot: async (_root: any, { id }: any) => {
    const spot = await prismaClient.spot.findFirst({
      where: {
        id,
      },
      include: {
        drops: true,
      },
    });

    if (!spot) {
      throw new Error("Error on get spot");
    }

    return { ...spot, image: createUrlFromBuffer(spot.image) };
  },
  spots: async (_root: any, _args: any) => {
    const spots = await prismaClient.spot.findMany({
      include: {
        drops: true,
      },
    });
    return spots.map((spot) => ({ ...spot, image: createUrlFromBuffer(spot.image) }));
  },
};

export const queryResolvers = {
  Query: resolvers,
};
