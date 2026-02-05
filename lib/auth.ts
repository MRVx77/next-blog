import { betterAuth } from "better-auth";

export const auth = betterAuth({
  appName: "NextBlog",
  secret: process.env.BETTER_AUTH_SECRET || " BETTER_AUTH_SECRET",
  baseURL: process.env.BASE_URL || "http://localhost:3000",
});
