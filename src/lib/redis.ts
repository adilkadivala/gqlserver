import Redis from "ioredis";

const redis = new Redis({
  db: 0,
});

export function initRedis() {
  redis.on("connect", () => {
    console.log("🚀 Redis client connected");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis client error:", err);
  });
}

export default redis;
