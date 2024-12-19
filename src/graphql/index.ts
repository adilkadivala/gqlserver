import { ApolloServer } from "@apollo/server";
import { User } from "./user";
import { Post } from "./posts";

async function createApollogqlServer() {
  // Apollo Server
  const gqlServer = new ApolloServer({
    typeDefs: `
          ${User.typeDefs}
          type Query {${User.quries}}
          type Mutation {${User.mutations}}

          ${Post.typeDefs}
          type Query {${Post.quries}}
          type Mutation {${Post.mutations}}

        `,
    resolvers: {
      Query: { ...User.resolvers.quries, ...Post.resolvers.quries },
      Mutation: { ...User.resolvers.mutations, ...Post.resolvers.mutations },
    },
  });

  // Start Apollo Server
  await gqlServer.start();

  return gqlServer;
}

export default createApollogqlServer;
