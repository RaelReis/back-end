import { prismaClient } from "../database/primsaClient";
import { Context } from "../server";

export const resolvers = {
  createDiary: async (_root: any, { newDiary }: any, { id }: Context) => {
    const userExists = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new Error(`User ID ${id} not found`);
    }

    // Back end fara isso automaticamente depois
    const diary = {
      ...newDiary,
      userId: id,
    };

    const res = await prismaClient.diary.create({
      data: diary,
    });

    return res;
  },
  updateDiary: async (_root: any, { id, data }: any) => {
    const res = await prismaClient.diary.update({
      where: {
        id,
      },
      data,
    });

    return res;
  },
  deleteDiary: async (_root: any, { id }: any) => {
    await prismaClient.diary.delete({
      where: {
        id,
      },
    });
    return true;
  },
  createWeekly: async (_root: any, { newWeekly }: any, { id }: Context) => {
    console.log('to executando o create weekly')
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
  updateDiaryIsCompleted: async (_root: any, { id }: any) => {
    const toUpdateDiary = await prismaClient.diary.findFirst({
      where: id,
    });

    if (!toUpdateDiary) {
      throw new Error(`Diary ID not found`);
    }

    const data = {
      ...toUpdateDiary,
      isCompleted: !toUpdateDiary.isCompleted,
    };

    const res = await prismaClient.diary.update({
      where: id,
      data,
    });

    return res;
  },
  updateWeeklyIsCompleted: async (_root: any, { id }: any) => {
    const toUpdateWeekly = await prismaClient.weekly.findFirst({
      where: id,
    });

    if (!toUpdateWeekly) {
      throw new Error(`Diary ID not found`);
    }

    const data = {
      ...toUpdateWeekly,
      isCompleted: !toUpdateWeekly.isCompleted,
    };

    const res = await prismaClient.diary.update({
      where: id,
      data,
    });

    return res;
  },
};

export const mutationResolvers = {
  Mutation: resolvers,
};
