import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
import cors from "cors";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  app.use(express.json());
  app.use(json());
  app.use(cors());

  // Apollo Server
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
      type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password:String!):Boolean
      }
    `,
    resolvers: {
      Query: {
        hello: () => `Hey there, I'm a GraphQL server`,
        say: (_, { name }: { name: string }) => `Hey ${name}! How Are You?`,
      },

      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await prismaClient.user.create({
            data: {
              firstName,
              lastName,
              email,
              password,
              salt: "random_salt",
            },
          });
          return true;
        },
      },
    },
  });

  // Start Apollo Server
  await gqlServer.start();

  // Root route
  app.get("/", (req, res) => {
    res.json({ message: "Server is running fine!" });
  });

  // GraphQL Middleware
  app.use(
    "/graphql",
    expressMiddleware(gqlServer) as unknown as express.RequestHandler
  );

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`🚀 gqlServer ready at http://localhost:${PORT}/graphql`);
  });
}

// fetching error
init().catch((err) => {
  console.error("Failed to start server:", err);
});
