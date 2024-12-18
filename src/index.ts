import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApollogqlServer from "./graphql";
import { json } from "body-parser";
import cors from "cors";
import UserService from "./services/user";

async function init() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  app.use(express.json());
  app.use(json());
  app.use(cors());

  // Apollo Server
  const gqlServer = await createApollogqlServer();

  // GraphQL Middleware
  app.use(
    "/graphql",
    expressMiddleware(gqlServer, {
      context: async ({ req }) => {
        const token = req.headers["token"];

        try {
          const user = UserService.decodeJWT(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    }) as unknown as express.RequestHandler
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
