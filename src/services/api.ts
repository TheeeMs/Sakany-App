import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

function pickHostFromExpo() {
  const candidates: Array<string | undefined> = [
    (Constants.expoConfig as { hostUri?: string } | null)?.hostUri,
    (
      Constants as unknown as {
        manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
      }
    ).manifest2?.extra?.expoClient?.hostUri,
    (Constants as unknown as { manifest?: { debuggerHost?: string } }).manifest
      ?.debuggerHost,
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const host = candidate.split(":")[0];
    if (!host || host === "localhost" || host === "127.0.0.1") {
      continue;
    }

    return host;
  }

  return null;
}

function resolveApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  const expoHost = pickHostFromExpo();
  if (expoHost) {
    return `http://${expoHost}:8080/v1`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080/v1";
  }

  return "http://localhost:8080/v1";
}

const API_BASE_URL = resolveApiBaseUrl();

let accessToken: string | null = null;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export function setApiAccessToken(token: string | null) {
  accessToken = token;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
