import { ApolloServer } from "apollo-server";
import { context } from "./context";
import { resolvers, typeDefs } from "./schema";

const PORT = 4003;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen(PORT).then(({ url }: { url: string }) => {
  console.log(`🚀 Server listening in ${url} 🚀`);
});
