import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to environment variables");
}

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("retro-recipe-db");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        "google_client_id_placeholder.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "google_client_secret_placeholder",
    },
  },
});
