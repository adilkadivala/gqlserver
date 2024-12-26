import express from "express";
import dotenv from "dotenv";
import { initRedis } from "./lib/redis";
// import { initializeApolloServer } from "./graphql";
import { setupMiddlewares } from "./middlewares/index";
// import router from "./routes/index";

dotenv.config();

async function init() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  // Initialize Redis
  initRedis();

  // Apply middlewares
  setupMiddlewares(app);

  // Setup routes
  // router();

  // Initialize Apollo Server
  // await initializeApolloServer(app);

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 backend ready at http://localhost:${PORT}`);
    console.log(`🚀 gqlServer ready at http://localhost:${PORT}/graphql`);
  });
}

init().catch((err) => {
  console.error("Failed to start server:", err);
});
