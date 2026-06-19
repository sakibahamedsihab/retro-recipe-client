const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${baseURL}${path}`;

  options.credentials = "include";

  const headers = { ...options.headers };
  if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData)
  ) {
    options.body = JSON.stringify(options.body);
    headers["Content-Type"] = "application/json";
  }
  options.headers = headers;

  const response = await fetch(url, options);

  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || response.statusText || "Request failed",
    );
    error.response = {
      status: response.status,
      statusText: response.statusText,
      data: data,
    };
    throw error;
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
}

const api = {
  get: (path, config = {}) => request(path, { method: "GET", ...config }),
  post: (path, data, config = {}) =>
    request(path, {
      method: "POST",
      body: data,
      ...config,
    }),
  put: (path, data, config = {}) =>
    request(path, {
      method: "PUT",
      body: data,
      ...config,
    }),
  patch: (path, data, config = {}) =>
    request(path, {
      method: "PATCH",
      body: data,
      ...config,
    }),
  delete: (path, config = {}) => request(path, { method: "DELETE", ...config }),
};

export default api;
