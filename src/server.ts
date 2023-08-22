import express from "express";
import cors from "cors";
import axios from "axios";
import coockieParser from "cookie-parser";
import { sign } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./database/primsaClient";
import { authMiddleware } from "./middlewares/auth";
import { resolvers, typeDefs } from "./schema";
import "./utils/schedule";

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
  const url = process.env.DISCORD_AUTH_URL || "";
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

  const cookieExpires = new Date().setDate(new Date().getDate() + 7);

  res.cookie("token", `Bearer ${token}`, { sameSite: "none", secure: true, maxAge: cookieExpires });
  res.redirect(301, process.env.CLIENT_REDIRECT_URL || "");
});

// app.get("/view", async (req, res) => {
//   await prismaClient.drop.deleteMany();
//   return res.json({});
// });

// app.get("/teste", async (_, res) => {
//   readFile("data.json", "utf-8", async (err, dataJson) => {
//     if (err) {
//       console.error("Erro ao ler o JSON", err);
//       return;
//     }

//     try {
//       const data = JSON.parse(dataJson);

//       // const toSendSpots = data.map((spot: { spot: any; spot_image: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }; }) => ({ name: spot.spot, image: Buffer.from(spot.spot_image, "base64") }));

//       // const spots = await prismaClient.spot.createMany({
//       //   data: toSendSpots,
//       // });

//       const _spots = (await prismaClient.spot.findMany()).map((spot) => ({ id: spot.id, name: spot.name }));

//       console.log(_spots);

//       let count = 0;
//       let newDropList: any[] = [];

//       data.map((spotInfo: { spot: string; dropList: any[] }) =>
//         spotInfo.dropList.map((drop) => {
//           const spotIndex = _spots.findIndex((spot) => spot.name === spotInfo.spot);
//           const spotId = _spots[spotIndex].id;

//           newDropList.push({
//             ...drop,
//             spotId,
//             price: +drop.price,
//             image: Buffer.from(drop.image, "base64"),
//           });
//         })
//       );

//       const _dropsAlreadyExists = await prismaClient.drop.findMany();
//       let dropsAlreadyExists = _dropsAlreadyExists.map((drop) => drop.name);

//       async function postDrops() {
//         for (const drop of newDropList) {
//           console.log("Vou conectar", drop.name, "no spot id", drop.spotId);

//           if (dropsAlreadyExists.includes(drop.name)) {
//             await prismaClient.drop.update({
//               where: {
//                 name: drop.name,
//               },
//               data: {
//                 spots: {
//                   connect: [{ id: drop.spotId }],
//                 },
//               },
//             });
//             count++;
//             continue;
//           }

//           const res = await prismaClient.drop.create({
//             data: {
//               name: drop.name,
//               image: drop.image,
//               price: drop.price,
//               tax: drop.tax,
//               spots: {
//                 connect: [{ id: drop.spotId }],
//               },
//             },
//           });
//           dropsAlreadyExists.push(res.name);
//           count++;
//         }
//       }

//       postDrops();

//       return res.json({});
//     } catch (error) {
//       console.error("Erro no parse do JSON", error);
//     }
//   });
// });

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
