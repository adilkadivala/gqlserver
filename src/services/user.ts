import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto"; // for making password hased
import JWT from "jsonwebtoken";

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
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;

    // making password hashed

    const salt = randomBytes(32).toString("hex");
    const hashedPassword = UserService.generateHash(salt, password);

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });
  }
  /**
   * static getUser for signin
   */

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static async getUser(payload: getUserPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserByEmail(email);

    // if user not exist
    if (!user) throw new Error("user not found");

    // if it exist then
    const userSalt = user.salt;
    const userHashPassword = UserService.generateHash(userSalt, password);

    // comapiring user with actual password

    if (userHashPassword !== user.password)
      throw new Error("Incorrect Password");

    // generaing gwt-token for sucessfully loged user
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }
}

export default UserService;
