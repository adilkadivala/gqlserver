import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApollogqlServer from "./graphql";
import { json } from "body-parser";
import cors from "cors";
import UserService from "./services/user";
import redis from "./lib/redis"; // Import the Redis client
import dotenv from "dotenv";

async function init() {
  dotenv.config();
  const app = express();
  const PORT = process.env.PORT || 8000;

  app.use(express.json());
  app.use(json());
  app.use(cors());

  // Redis connection
  redis.on("connect", () => {
    console.log("🚀 Redis client connected");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis client error:", err);
  });

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
          await redis.hset("currentLogedInusers", `user`, JSON.stringify(user));
          console.log(user, "now");
          return { user };
        } catch (error: any) {
          return error;
        }
      },
    }) as unknown as express.RequestHandler
  );

  // Add this route after your other routes, before starting the server
  app.get("/test-redis", async (req, res) => {
    try {
      await redis.set("testKey", "Hello from Express!");
      const value = await redis.get("testKey");
      // Set an expiration of 5 minutes instead of deleting immediately
      await redis.expire("testKey", 300);
      res.json({
        success: true,
        value,
        message: "Key will expire in 5 minutes",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 backend ready at http://localhost:${PORT}`);
    console.log(`🚀 gqlServer ready at http://localhost:${PORT}/graphql`);
  });
}

// fetching error
init().catch((err) => {
  console.error("Failed to start server:", err);
});
