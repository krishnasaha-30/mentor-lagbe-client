import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MongoDB_URI as string);

const db = client.db("mentor-lagbe-app");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL as string,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    // The sign-up form asks for at least 6 characters.
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      // `type` turns this into an enum, so role can only be one of these values.
      role: {
        type: ["student", "tutor", "admin"],
        required: true,
        defaultValue: "student",
        // `input: true` allows the sign-up request to send the chosen role.
        input: true,
      },
      // New accounts always start on the free plan. Only the payment
      // verification (server side) may upgrade a user to "pro".
      plan: {
        type: ["free", "pro"],
        required: true,
        defaultValue: "free",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Admins are promoted in the database, never through the sign-up
        // form. Without this guard a request could POST role: "admin".
        before: async (user) => {
          if (user.role === "admin") {
            return { data: { ...user, role: "student" } };
          }
          return { data: user };
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
