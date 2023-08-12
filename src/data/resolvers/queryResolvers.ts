import { Context } from "../../server";

const resolvers = {
  user: async (_: any, { id }: any, { userApi }: Context) => {
    const user = await userApi.getUser(id);

    if (!user) {
      console.log("não achuei");
    }

    return user;
  },
  users: async (_: any, __: any, ___: Context) => {
    return [
      {
        id: "1",
        discord_id: "51651651398415",
        username: "Kelon",
        avatar: "fsadkgaslçgm,çfasdf",
        diaries: [
          {
            id: "OPLionYTVYV",
            title: "Jettina",
            description: "Descrição aqui",
            isCompleted: false,
            resetDay: "2023-08-07T15:45:25.993Z",
            createdAt: "2023-08-07T15:38:04.633Z",
            updatedAt: "2023-08-07T15:38:04.633Z",
          },
        ],
        weeklies: [
          {
            id: "OPLionYTVYV",
            title: "Jettina",
            description: "Descrição aqui",
            isCompleted: false,
            resetDay: "2023-08-07T15:45:25.993Z",
            createdAt: "2023-08-07T15:38:04.633Z",
            updatedAt: "2023-08-07T15:38:04.633Z",
          },
        ],
        createdAt: "2023-08-07T15:35:25.993Z",
        updatedAt: "2023-08-07T15:35:25.993Z",
      },
    ];
  },
  diaries: async (_: any, { userId }: any, { userApi }: Context) => {
    const diaries = await userApi.getDiaries(userId);
    return diaries;
  },
  weeklies: async (_: any, { userId }: any, { userApi }: Context) => {
    const weeklies = await userApi.getWeeklies(userId);
    return weeklies;
  },
};

export const queryResolvers = {
  Query: resolvers,
};
