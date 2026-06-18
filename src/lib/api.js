const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = {
  // মেথড-১: ডেটা গেট করার জন্য (GET)
  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // এই লাইনটাই স্বয়ংক্রিয়ভাবে আমাদের সিকিউর httpOnly কুকি ব্যাকএন্ডে পাঠাবে
    });
    return res.json();
  },

  // মেথড-২: ডেটা সাবমিট বা সিঙ্ক করার জন্য (POST)
  post: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // কুকি পারমিশন
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // মেথড-৩: ডেটা পারশিয়াল আপডেট করার জন্য (PATCH)
  patch: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // মেথড-৪: ডেটা ডিলিট করার জন্য (DELETE)
  delete: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.json();
  },
};

export default api;
