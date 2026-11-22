import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const mongoUri =
  process.env.MongoDB_URI || process.env.MONGODB_URI || "";

const client = new MongoClient(mongoUri);

const db = client.db("mentor-lagbe-app");
const betterAuthUrl =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  (process.env.NODE_ENV === "production"
    ? "https://mentor-lagbe-client-six.vercel.app"
    : "http://localhost:3000");

const authIssuer = new URL(betterAuthUrl).origin;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: betterAuthUrl,
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://mentor-lagbe-client-six.vercel.app",
    authIssuer,
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
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
      phone: {
        type: "string",
        required: false,
        input: false,
      },
      bio: {
        type: "string",
        required: false,
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
  plugins: [
    jwt({
      jwt: {
        issuer: authIssuer,
        audience: "mentor-lagbe-api",
        expirationTime: "1h",
      },
      jwks: {
        keyPairConfig: { alg: "EdDSA", crv: "Ed25519" },
      },
    }),
  ],
});
