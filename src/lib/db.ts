import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();

export function database() {
  prismaClient
    .$connect()
    .then(() => {
      console.log("🚀 Prisma client connected");
    })
    .catch((err) => {
      console.log("❌ Prisma client error:", err);
    });
}
