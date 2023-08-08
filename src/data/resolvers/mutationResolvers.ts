import { ValidationError } from "apollo-server";
import { Context } from "../../context";
import { Diary } from "../models/Diaries";

export const resolvers = {
  createDiary: async (_: any, { newDiary }: any, { userApi }: Context) => {
    const { userId } = newDiary;

    try {
      await userApi.getUser(userId);
    } catch (error) {
      throw new ValidationError(`User ID ${userId} not found`);
    }

    // Back end fara isso automaticamente depois
    const diary = {
      ...newDiary,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await userApi.createDiary(diary);
    return res;
  },
  updateDiary: async (_: any, args: any, { userApi }: Context) => {
    const { id, data } = args;

    const newData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const res = await userApi.updateDiary(id, newData);

    return res;
  },
  deleteDiary: async (_: any, { id }: any, { userApi }: Context) => {
    const res = await userApi.deleteDiary(id);
    return !!res;
  },
  createWeekly: async (_: any, { data }: any, { userApi }: Context) => {
    // Back end fara isso automaticamente depois
    const newWeekly = {
      ...data,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await userApi.createWeekly(newWeekly);
    return res;
  },
  updateWeekly: async (_: any, args: any, { userApi }: Context) => {
    const { id, data } = args;

    const newData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const res = await userApi.updateWeekly(id, newData);

    return res;
  },
  deleteWeekly: async (_: any, { id }: any, { userApi }: Context) => {
    const res = await userApi.deleteWeekly(id);
    return !!res;
  },
  updateMetaIsCompleted: async (_: any, args: any, { userApi }: Context) => {
    const { id, metaType } = args;

    let newMeta;

    if (metaType === "diary") {
      try {
        const toChangeDiary = await userApi.verifyDiary(id);

        const changedDiary = {
          ...toChangeDiary,
          isCompleted: !toChangeDiary.isCompleted,
        };

        newMeta = await userApi.updateDiary(id, changedDiary);
      } catch (error) {
        throw new ValidationError(`Diary ID not found`);
      }
    }

    if (metaType === "weekly") {
      try {
        const toChangeWeekly = await userApi.verifyWeekly(id);

        const changedWeekly = {
          ...toChangeWeekly,
          isCompleted: !toChangeWeekly.isCompleted,
        };

        newMeta = await userApi.updateWeekly(id, changedWeekly);
      } catch (error) {
        throw new ValidationError(`Weekly ID not found`);
      }
    }

    return newMeta;
  },
};

export const mutationResolvers = {
  Mutation: resolvers,
};
