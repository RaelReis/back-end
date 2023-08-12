import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { resolvers, typeDefs } from "./schema";
import { UserApi } from "./data/dataSources/userApi";
import axios from "axios";
import { sign, verify } from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { GraphQLError } from "graphql";
import { User } from "./data/models/User";

export interface Context {
  userApi: UserApi;
  user: User;
}

const PORT = 4003;

const app = express();

app.use(cors(), express.json());

const apolloServer = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  introspection: true,
});

app.get("/auth/discord/login", (req, res) => {
  const url =
    "https://discord.com/api/oauth2/authorize?client_id=1139723744332501032&redirect_uri=https%3A%2F%2Fe1c1-2804-7f0-b780-97c8-854e-263f-d8dc-40b6.ngrok-free.app%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify";
  res.redirect(url);
});

app.get("/auth/discord/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) throw new Error("Code not provided");

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID || "",
    client_secret: process.env.DISCORD_CLIENT_SECRET || "",
    grant_type: "authorization_code",
    code: code as string,
    redirect_uri: process.env.DISCORD_REDIRECT_URI || "",
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept-Encoding": "application/x-www-form-urlencoded",
  };

  const { data: authData } = await axios.post("https://discord.com/api/oauth2/token", params, {
    headers,
  });

  const { data: userData } = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${authData.access_token}`, ...headers },
  });

  const { id, avatar, username } = userData;

  const userApi = new UserApi();

  const users = await userApi.getUsers({});

  const checkIfUserExists = users.some((user) => user.discord_id === id);

  if (!checkIfUserExists) {
    const newUser = {
      discord_id: id,
      username,
      avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userApi.createUser(newUser);
  }

  const token = await sign({ sub: id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

  res.json({ token });
});

apolloServer.start().then(() => {
  app.use(
    "/graphql",
    expressjwt({ algorithms: ["HS256"], secret: process.env.JWT_SECRET || "" }),
    apolloMiddleware(apolloServer, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization;

        const userApi = new UserApi();
        const user = await userApi.getUser("2");

        return { userApi, user };
      },
    })
  );

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server listening in http://localhost:${PORT} 🚀`);
  });
});
