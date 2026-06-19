import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth-এর সব রিকোয়েস্ট (GET, POST) এই হ্যান্ডলার সামলাবে
export const { GET, POST } = toNextJsHandler(auth);
