const STORAGE_KEY_PROJECT_ID = "project_id";
const STORAGE_KEY_PROJECT_NAME = "project_name";

function getAuthHeaders(): Record<string, string> {
  const projectId = sessionStorage.getItem(STORAGE_KEY_PROJECT_ID);
  const projectName = sessionStorage.getItem(STORAGE_KEY_PROJECT_NAME);

  if (!projectId || !projectName) {
    return {};
  }

  return {
    "X-Project-ID": projectId,
    "X-Project-Name": projectName,
  };
}

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {};

  if (requiresAuth) {
    const authHeaders = getAuthHeaders();
    Object.assign(headers, authHeaders);

    if (!authHeaders["X-Project-ID"] || !authHeaders["X-Project-Name"]) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Not authenticated");
    }
  }

  if (fetchOptions.headers) {
    const customHeaders = fetchOptions.headers as Record<string, string>;
    Object.assign(headers, customHeaders);
  }

  return fetch(url, {
    ...fetchOptions,
    headers,
  });
}

export const api = {
  get: (url: string, requiresAuth = true) =>
    apiFetch(url, { method: "GET", requiresAuth }),

  post: (url: string, body?: unknown, requiresAuth = true) =>
    apiFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    }),

  patch: (url: string, body?: unknown, requiresAuth = true) =>
    apiFetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    }),

  delete: (url: string, requiresAuth = true) =>
    apiFetch(url, { method: "DELETE", requiresAuth }),
};
