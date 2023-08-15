import express from "express";
import cors from "cors";
import axios from "axios";
import coockieParser from "cookie-parser";
import { sign } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { authMiddleware } from "./middlewares/express";
import { resolvers, typeDefs } from "./schema";
import { UserApi } from "./data/dataSources/userApi";

export interface Context {
  userApi: UserApi;
  userId: string;
}

export interface ReqUser {
  id: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: ReqUser;
    }
  }
}

const PORT = 4003;

const app = express();

const apolloServer = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

app.use(
  cors({
    origin: "http://localhost:5173", // Substitua pelo seu domínio
    credentials: true, // Permite credenciais (cookies, etc.)
  }),
  express.json(),
  coockieParser()
);

app.get("/auth/discord/login", (req, res) => {
  const url =
    "https://discord.com/api/oauth2/authorize?client_id=1139723744332501032&redirect_uri=http%3A%2F%2Flocalhost%3A4003%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify";
  res.redirect(301, url);
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

  const checkIfUserExists = users.some((user) => user.id === id);

  if (!checkIfUserExists) {
    const newUser = {
      id: id,
      username,
      avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userApi.createUser(newUser);
  }

  const token = await sign({ sub: id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

  res.cookie("token", `Bearer ${token}`);
  res.redirect(301, "http://localhost:5173/home");
});

apolloServer.start().then(() => {
  app.use(
    "/graphql",
    authMiddleware,
    apolloMiddleware(apolloServer, {
      context: async ({ req }) => {
        const { id } = req.user as { id: string };

        if (!id) {
          throw new GraphQLError("User is not authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }

        return { userApi: new UserApi(), userId: id };
      },
    })
  );

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server listening in http://localhost:${PORT} 🚀`);
  });
});
