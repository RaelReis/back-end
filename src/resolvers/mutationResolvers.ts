import { prismaClient } from "../database/primsaClient";
import { Context } from "../server";

export const resolvers = {
  createDaily: async (_root: any, { newDaily }: any, { id }: Context) => {
    const userExists = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new Error(`User ID ${id} not found`);
    }

    // Back end fara isso automaticamente depois
    const daily = {
      ...newDaily,
      userId: id,
    };

    const res = await prismaClient.daily.create({
      data: daily,
    });

    return res;
  },
  updateDaily: async (_root: any, { id, data }: any) => {
    const res = await prismaClient.daily.update({
      where: {
        id,
      },
      data,
    });

    return res;
  },
  deleteDaily: async (_root: any, { id }: any) => {
    await prismaClient.daily.delete({
      where: {
        id,
      },
    });
    return true;
  },
  createWeekly: async (_root: any, { newWeekly }: any, { id }: Context) => {
    console.log("to executando o create weekly");
    const userExists = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new Error(`User ID ${id} not found`);
    }

    // Back end fara isso automaticamente depois
    const data = {
      ...newWeekly,
      userId: id,
    };

    const res = await prismaClient.weekly.create({
      data,
    });

    return res;
  },
  updateWeekly: async (_root: any, { id, data }: any) => {
    const res = await prismaClient.weekly.update({
      where: {
        id,
      },
      data,
    });

    return res;
  },
  deleteWeekly: async (_root: any, { id }: any) => {
    await prismaClient.weekly.delete({
      where: {
        id,
      },
    });
    return true;
  },
  updateDailyIsCompleted: async (_root: any, { id }: any) => {
    const toUpdateDaily = await prismaClient.daily.findFirst({
      where: {
        id: id,
      },
    });

    if (!toUpdateDaily) {
      throw new Error(`Daily ID not found`);
    }

    const data = {
      ...toUpdateDaily,
      isCompleted: !toUpdateDaily.isCompleted,
    };

    const res = await prismaClient.daily.update({
      where: {
        id: id,
      },
      data,
    });

    return res;
  },
  updateWeeklyIsCompleted: async (_root: any, { id }: any) => {
    const toUpdateWeekly = await prismaClient.weekly.findFirst({
      where: {
        id: id,
      },
    });

    if (!toUpdateWeekly) {
      throw new Error(`Daily ID not found`);
    }

    const data = {
      ...toUpdateWeekly,
      isCompleted: !toUpdateWeekly.isCompleted,
    };

    const res = await prismaClient.daily.update({
      where: {
        id: id,
      },
      data,
    });

    return res;
  },
  createGoal: async (__root: any, { itemId }: any, { id }: Context) => {
    const goal = await prismaClient.goal.create({
      data: {
        itemId: itemId,
        userId: id,
      },
      include: {
        item: true,
      },
    });

    return goal;
  },
};

export const mutationResolvers = {
  Mutation: resolvers,
};
