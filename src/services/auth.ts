import { api } from "./api";

export interface AuthResponse {
  userId?: string | null;
  accessToken: string;
  refreshToken: string;
}

export interface LoginEmailPayload {
  email: string;
  password: string;
}

export type RegisterLoginMethod = "EMAIL_PASSWORD" | "PHONE_OTP" | "GOOGLE";
export type ResidentType = "PROPERTY_OWNER" | "TENANT" | "FAMILY_MEMBER";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  type: ResidentType;
  unitId: string;
  loginMethod: RegisterLoginMethod;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  loginMethod: string;
}

export async function loginWithEmail(payload: LoginEmailPayload) {
  const { data } = await api.post<AuthResponse>("/auth/login/email", payload);
  return data;
}

export async function registerWithEmail(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function refreshAccessToken(payload: RefreshPayload) {
  const { data } = await api.post<AuthResponse>("/auth/refresh", payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<CurrentUser>("/auth/me");
  return data;
}
