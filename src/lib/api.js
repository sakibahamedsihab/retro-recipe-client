const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  // ডিফল্ট হেডার্স এবং ক্রেডেনশিয়ালস
  const defaultOptions = {
    credentials: "include", // ব্যাকএন্ডে টোকেন (HTTPOnly Cookie) পাঠানোর জন্য খুবই গুরুত্বপূর্ণ
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    // রেসপন্স যদি JSON না হয় (যেমন 404 বা 500 HTML), সেক্ষেত্রে ক্র্যাশ এড়ানোর জন্য
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong fetching data");
    }

    return data;
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    throw error;
  }
}
