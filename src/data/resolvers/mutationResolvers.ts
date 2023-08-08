import { Context } from "../../context";

export const resolvers = {
  createDiary: async (_: any, { data }: any, { userApi }: Context) => {
    // Back end fara isso automaticamente depois
    const newDiary = {
      ...data,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await userApi.createDiary(newDiary);
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
};

export const mutationResolvers = {
  Mutation: resolvers,
};
