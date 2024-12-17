import { ApolloServer } from "@apollo/server";
import { User } from "./user";

async function createApollogqlServer() {
  // Apollo Server
  const gqlServer = new ApolloServer({
    typeDefs: `
          type Query {${User.quries}}
          type Mutation {${User.mutations}}
        `,
    resolvers: {
      Query: { ...User.resolvers.quries },
      Mutation: { ...User.resolvers.mutations },
    },
  });

  // Start Apollo Server
  await gqlServer.start();

  return gqlServer;
}

export default createApollogqlServer;
