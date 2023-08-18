import express from "express";
import cors from "cors";
import axios from "axios";
import coockieParser from "cookie-parser";
import { sign } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./database/primsaClient";
import { authMiddleware } from "./middlewares/express";
import { resolvers, typeDefs } from "./schema";

export interface Context {
  id: string;
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
    origin: process.env.CLIENT_URL, // Substitua pelo seu domínio
    credentials: true, // Permite credenciais (cookies, etc.)
  }),
  express.json(),
  coockieParser()
);

app.get("/auth/discord/login", (req, res) => {
  const url =
    "https://discord.com/api/oauth2/authorize?client_id=1139723744332501032&redirect_uri=https%3A%2F%2Fblack-desert-meta-api.vercel.app%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify";
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

  const userAlreadyExists = await prismaClient.user.findFirst({ where: { id } });

  if (!userAlreadyExists) {
    const newUser = {
      id,
      username,
      avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
    };

    await prismaClient.user.create({ data: newUser });
  }

  const token = await sign({ sub: id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

  res.cookie("token", `Bearer ${token}`, { sameSite: "none", secure: true });
  res.redirect(301, process.env.CLIENT_REDIRECT_URL || "");
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

        return { id };
      },
    })
  );

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server listening in http://localhost:${PORT} 🚀`);
  });
});
