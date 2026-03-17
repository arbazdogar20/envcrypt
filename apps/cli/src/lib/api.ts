import axios from "axios";
import { getToken, getApiUrl } from "./config";

export function createClient() {
  const token = getToken();
  const baseURL = getApiUrl();

  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        console.error("\nNot authenticated. Run: envcrypt login\n");
        process.exit(1);
      }
      return Promise.reject(err);
    },
  );

  return client;
}
