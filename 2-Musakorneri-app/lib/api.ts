import { refreshToken } from "./auth";
import { isTokenExpired } from "./token-utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  let token = localStorage.getItem("accessToken");

  // Check if token is expired before making request
  if (token && isTokenExpired(token)) {
    const refreshResult = await refreshToken();
    token = refreshResult?.AuthenticationResult?.AccessToken || null;

    if (!token) {
      window.location.href = "/login";
      throw new Error("Authentication failed");
    }
  }

  const makeRequest = async (authToken: string | null) => {
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...options.headers,
      },
    };

    return fetch(`${API_BASE_URL}${endpoint}`, config);
  };

  let response = await makeRequest(token);

  // If token expired, try to refresh
  if (response.status === 401) {
    const refreshResult = await refreshToken();

    if (refreshResult?.AuthenticationResult?.AccessToken) {
      token = refreshResult.AuthenticationResult.AccessToken;
      response = await makeRequest(token);
    } else {
      window.location.href = "/login";
      throw new Error("Authentication failed");
    }
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getCurrentUser() {
  return apiRequest("/users/me");
}
