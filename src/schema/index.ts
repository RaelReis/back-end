import { userTypeDefs } from "./typeDefs";
import { queryResolvers } from "../resolvers/queryResolvers";
import { fieldResolvers } from "../resolvers/fieldResolvers";
import { mutationResolvers } from "../resolvers/mutationResolvers";

const rootTypeDefs = `#graphql
  type Query {
    _empty: Boolean
  }

  type Mutation {
    _empty: Boolean
  }
`;

const rootResolvers = {
  Query: {
    _empty: () => true,
  },
  Mutation: {
    _empty: () => true,
  },
};

export const typeDefs = [rootTypeDefs, userTypeDefs];
export const resolvers = [
  rootResolvers,
  queryResolvers,
  fieldResolvers,
  mutationResolvers,
];
