// frontend/lib/adminApi.ts
export async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    throw new Error("No admin token");
  }
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "omit",
  });
  if (res.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
    throw new Error("Session expired");
  }
  return res;
}