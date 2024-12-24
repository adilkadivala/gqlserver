import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto"; // for making password hashed
import JWT from "jsonwebtoken";
import redis from "../lib/redis";

// secret of JWT
const JWT_SECRET = "$uper@nd$ecret";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface getUserPayload {
  email: string;
  password: string;
}

class UserService {
  // hashing password
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    return hashedPassword;
  }

  /**
   * static createUser
   */
  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;

    // making password hashed
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = UserService.generateHash(salt, password);

    const createNewUser = await prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });

    // Clear cache for users list
    await redis.del("users");

    return createNewUser;
  }

  /**
   * static getUser for signin
   */
  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static async getUser(payload: getUserPayload) {
    const { email, password } = payload;

    // Check if the user exists in Redis
    const cachedUser = await redis.get(`user:${email}`);
    let user;

    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      user = await UserService.getUserByEmail(email);

      // Cache user in Redis
      if (user) {
        await redis.set(`user:${email}`, JSON.stringify(user), "EX", 3600); // Cache for 1 hour
      }
    }

    // if user not exist
    if (!user) throw new Error("User not found");

    // Verify password
    const userSalt = user.salt;
    const userHashPassword = UserService.generateHash(userSalt, password);

    if (userHashPassword !== user.password)
      throw new Error("Incorrect Password");

    // Generate JWT token
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }

  /**
   * Get user by ID with Redis caching
   */
  public static async getUserById(id: string) {
    // Check if the user exists in Redis
    const cachedUser = await redis.get(`user:${id}`);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    // Fetch from database if not in cache
    const user = await prismaClient.user.findUnique({ where: { id } });

    // Cache the user in Redis
    if (user) {
      await redis.set(`user:${id}`, JSON.stringify(user), "EX", 3600); // Cache for 1 hour
    }

    return user;
  }

  /**
   * Decode JWT
   */
  public static decodeJWT(token: string) {
    return JWT.verify(token, JWT_SECRET);
  }
}

export default UserService;
