import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// আপনার .env ফাইলের URI এবং DB Name ব্যবহার করে কানেকশন
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  // ইমেইল এবং পাসওয়ার্ড লগিন এনাবল করা
  emailAndPassword: {
    enabled: true,
  },
});
