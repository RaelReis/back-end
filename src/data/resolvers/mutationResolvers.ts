import { Context } from "../../server";

export const resolvers = {
  createDiary: async (_root: any, { newDiary }: any, { userApi, userId }: Context) => {
    try {
      await userApi.getUser(userId);
    } catch (error) {
      throw new Error(`User ID ${userId} not found`);
    }

    // Back end fara isso automaticamente depois
    const diary = {
      ...newDiary,
      userId,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await userApi.createDiary(diary);
    return res;
  },
  updateDiary: async (_root: any, { id, data }: any, { userApi }: Context) => {
    const newData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const res = await userApi.updateDiary(id, newData);

    return res;
  },
  deleteDiary: async (_root: any, { id }: any, { userApi }: Context) => {
    const res = await userApi.deleteDiary(id);
    return !!res;
  },
  createWeekly: async (_root: any, { newWeekly }: any, { userApi, userId }: Context) => {
    try {
      await userApi.getUser(userId);
    } catch (error) {
      throw new Error(`User ID ${userId} not found`);
    }

    // Back end fara isso automaticamente depois
    const weekly = {
      ...newWeekly,
      userId,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await userApi.createWeekly(weekly);
    return res;
  },
  updateWeekly: async (_root: any, { id, data }: any, { userApi }: Context) => {
    const newData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const res = await userApi.updateWeekly(id, newData);

    return res;
  },
  deleteWeekly: async (_root: any, { id }: any, { userApi }: Context) => {
    const res = await userApi.deleteWeekly(id);
    return !!res;
  },
  updateMetaIsCompleted: async (_root: any, { id, metaType }: any, { userApi }: Context) => {
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
        throw new Error(`Diary ID not found`);
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
        throw new Error(`Weekly ID not found`);
      }
    }

    return newMeta;
  },
};

export const mutationResolvers = {
  Mutation: resolvers,
};
