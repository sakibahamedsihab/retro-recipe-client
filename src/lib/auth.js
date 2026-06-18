// src/lib/auth.js
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

// মঙ্গোডিবি ক্লায়েন্ট ইনিশিয়েলাইজেশন
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        default: "user", // আমাদের প্রজেক্টের ডিফল্ট রোল 'user', অ্যাডমিন প্যানেল থেকে এটি চেঞ্জ করা যাবে
      },
      isPremium: {
        type: "boolean",
        default: false,
      },
    },
  },
  plugins: [
    admin(), // অ্যাডমিন মডারেশন প্লাগইন অ্যাক্টিভেট করা হলো
  ],
});
